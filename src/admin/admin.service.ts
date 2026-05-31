import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditUserDto } from './dto';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) { }

  async getDashboardStats() {
    const courses = await this.prisma.course.findMany();
    const courseNumber = courses.length;

    const students = await this.prisma.user.findMany({
      where: {
        role: "USER",
      }
    })
    const studentCount = students.length;

    const challenges = await this.prisma.challenge.findMany();
    const challengeCount = challenges.length;

    const premium = await this.prisma.user.findMany({
      where: {
        isPremium: true,
      }
    })
    const premiumCount = premium.length

    return { courseNumber, studentCount, challengeCount, premiumCount };
  }

  async getGraphStats() {
    const data = await this.prisma.user.groupBy({
      by: ['createdAt'],
      _count: { id: true },
    });

    // Transform into month-based aggregation
    const stats = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (11 - i));
      const month = date.toLocaleString("default", { month: "short" });

      const users = data.filter(d =>
        d.createdAt.getMonth() === date.getMonth() &&
        d.createdAt.getFullYear() === date.getFullYear()
      ).reduce((sum, d) => sum + d._count.id, 0);

      return { month, users };
    });

    return stats;
  }



  async getUsers() {
    // Fetch all
    const users = await this.prisma.user.findMany();

    //return the users;
    return users;
  }

  async deleteUser(id: string) {
    const userId = Number(id);

    try {
      // 1. Delete messages (both sent and received)
      await this.prisma.message.deleteMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId }
          ]
        }
      });

      // 2. Clear progress-related tables
      await this.prisma.userLessonProgress.deleteMany({ where: { userId } });
      await this.prisma.userCourseProgress.deleteMany({ where: { userId } });
      await this.prisma.userModuleProgress.deleteMany({ where: { userId } });
      await this.prisma.miniModuleProgress.deleteMany({ where: { userId } });

      // 3. Clear interaction-related tables
      await this.prisma.completedChallenges.deleteMany({ where: { userId } });
      await this.prisma.challengeLike.deleteMany({ where: { userId } });
      await this.prisma.courseLike.deleteMany({ where: { userId } });
      await this.prisma.courseRating.deleteMany({ where: { userId } });

      // 4. Delete profile image
      await this.prisma.userProfileImage.deleteMany({ where: { userId } });

      // 5. Delete courses created by this user
      await this.prisma.course.deleteMany({ where: { creatorId: userId } });

      // 6. Finally delete the user
      await this.prisma.user.delete({
        where: { id: userId }
      });

      // return sucess message

      return { message: "User and all related records deleted successfully" };
    } catch (error: any) {
      console.error("Error during user deletion:", error);
      throw new HttpException(`Unable to delete User: ${error.message || 'Unknown error'}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async editUser(userId: number, dto: EditUserDto) {

    // update user profile
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isPremium: dto.isPremium,
        email: dto.email,
        username: dto.username,
      },
    });

    //return updated user
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      isPremium: user.isPremium,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }

  //creating a lesson Solution
  async createLessonSolution(dto: { lessonId: number, solution: string }) {
    try {

      await this.prisma.lessonSolution.create({
        data: dto
      });

      return { message: "Solution created Successfully" };
    } catch (error) {
      console.log(error);
      throw new HttpException("INTERNAL SERVER ERROR:", HttpStatus.INTERNAL_SERVER_ERROR);
    }


  }

  async getLessonCompleters(challengeId: number) {
    
    //Checking if completer already exists
    const challengeCompleters = await this.prisma.completedChallenges.findMany({
      where: { challengeId }
    });

    //Arranging the completers in with there information
    const completerUsers = await Promise.all(
      challengeCompleters.map(async (challengeCompleter) => {

        const someObj = {
          user: await this.prisma.user.findUnique({
            where: { id: challengeCompleter.userId },
            select: {
              id: true,
              email: true,
              username: true,
              photo: true,
              provider: true
            }
          }),
          id: challengeCompleter.id,
          completionTime: challengeCompleter.createdAt,
          url: challengeCompleter.url,
          solution: challengeCompleter.userSolution,
          correct: challengeCompleter.correct,
          marks: challengeCompleter.marks
        }

        return someObj
      })
    );

    return completerUsers;
  }

  async correctCompleters(completerId: number, dto: { userId: number }) {

    //1. Check if completion actually existist
    const completer = await this.prisma.completedChallenges.findFirst({
      where: {
        id: completerId
      }
    });

    if (!completer) {
      throw new NotFoundException("Completion not found");
    }

    //2. Check if challenge does exists
    const challenge = await this.prisma.challenge.findUnique({
      where: {
        id: completer.challengeId
      }
    });

    //declaring the marks to provide or providing zero if none
    const marksToAward = challenge?.marks || 0;
    console.log(`Awarding ${marksToAward} marks for challenge ${challenge?.id} (Title: ${challenge?.title})`);

    try {
      //4. Marking "WRIGHT" to answers and providing marks
      await this.prisma.completedChallenges.update({
        where: {
          id: completerId
        },
        data: {
          correct: "WRIGHT",
          marks: marksToAward
        }
      });

      await this.prisma.message.create({
        data: {
          content: `Your answer for the ${challenge?.title} challenge was correct. You have been awarded ${marksToAward} marks.`,
          type: 'text',
          senderId: 2,
          receiverId: dto.userId,
        }
      });

      return {
        message: "Done correcting completer"
      };
    } catch (error) {
      console.error("Error correcting completer:", error);
      throw new InternalServerErrorException("Unable to correct");
    }
  }

  async rejectAnswer(answerId: number, dto: { userId: number }) {
    //Same process as correcting the answer but difference is "WRONG"
    const answer = await this.prisma.completedChallenges.findUnique({
      where: {
        id: answerId
      }
    })

    if (!answer) {
      throw new BadRequestException("No such answer")
    }

    const challenge = await this.prisma.challenge.findUnique({
      where: {
        id: answer?.challengeId
      }
    })

    if (!answer) {
      throw new NotFoundException("Answer was not provided")
    }

    try {
      await this.prisma.completedChallenges.update({
        where: {
          id: answerId
        },
        data: {
          correct: "WRONG"
        }
      })

      await this.prisma.message.create({
        data: {
          content: `Sorry your answer for the ${challenge?.title} challenge has reached us but it needs updating ie Its not correct so far.
        You can talk to me if you need any help`,
          type: 'text',
          senderId: 2,
          receiverId: dto.userId,
        }
      });

      return (
        await this.prisma.completedChallenges.delete(
          {
            where: {
              id: answerId
            }
          }
        ))
    } catch (error) {
      throw new InternalServerErrorException("Failed to sign reject answer")
    }
  }

}
