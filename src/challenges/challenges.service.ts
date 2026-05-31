import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreateChallengeDto } from './dto/createChallenge.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChallengeCompleter, CreateChallengeInstructionDto, CreateChallengeSolutionDto } from './dto';
import { v2 as cloudinary } from 'cloudinary';
// import slugify from "slugify";

@Injectable()
export class ChallengesService {
  private readonly logger = new Logger(ChallengesService.name);

  constructor(private prisma: PrismaService) { }
  async createChallenge(dto: CreateChallengeDto, file?: Express.Multer.File) {
    try {
      let url: string | undefined;
      console.log("file to be uploaded: ", file);
      if (file) {
        url = await new Promise<string>((resolve, reject) => {
          // Sanitize file name (remove spaces/special chars)
          const cleanName = file.originalname
            .replace(/\s+/g, "_")         // spaces -> underscores
            .replace(/[^a-zA-Z0-9_.-]/g, ""); // keep only safe chars
          const base64File = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
          cloudinary.uploader.upload(base64File,
            {
              folder: "challenge-documents",
              resource_type: "auto",
              use_filename: true,
              public_id: cleanName,
              filename_override: cleanName,
              type: "upload",            // <-- force public file
              access_mode: "public",

            },
            (error, result: any) => {
              if (error) return reject(error);
              if (!result?.secure_url) return reject(new Error("Upload failed"));
              console.log("Upload result: ", result);
              resolve(result.secure_url);
            }
          );
        });
      }

      const challenge = await this.prisma.challenge.create({
        data: {
          ...dto,
          marks: dto.marks || 10,
          documentUrl: url,
        }
      });

      return {
        message: "Challenge created successfully",
        challenge,
      };
    } catch (error) {
      this.logger.error("Challenge creation failed:", error);
      throw new HttpException(
        (error as any).message || "Failed to create challenge",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }



  async updateChallenge(id: string, dto: any) {
    const challengeId = Number(id);

    if (isNaN(challengeId)) {
      return "Challenge id is not a number";
    }

    try {
      const updatedChallenge = await this.prisma.challenge.update({
        where: { id: challengeId },
        data: dto
      });

      return updatedChallenge;
    } catch (error) {
      this.logger.error('Request failed:', error);
      return "Failed to update challenge";
    }
  }

  async toggleLike(challengeId: string, userId: number) {
    const cId = Number(challengeId);

    if (isNaN(cId)) {
      throw new BadRequestException("Invalid challenge Id, must be a number");
    }

    const challenge = await this.prisma.challenge.findUnique({
      where: { id: cId },
    });

    if (!challenge) {
      throw new NotFoundException("Challenge not found");
    }

    // Check if user already liked
    const existingLike = await this.prisma.challengeLike.findUnique({
      where: {
        userId_challengeId: {
          userId,
          challengeId: cId,
        },
      },
    });

    if (existingLike) {
      // 👎 User already liked → remove like
      await this.prisma.challengeLike.delete({
        where: { id: existingLike.id },
      });

      await this.prisma.challenge.update({
        where: { id: cId },
        data: { likes: { decrement: 1 } },
      });

      return { liked: false, message: "Challenge disliked" };
    } else {
      // 👍 User not liked yet → add like
      await this.prisma.challengeLike.create({
        data: {
          userId,
          challengeId: cId,
        },
      });

      await this.prisma.challenge.update({
        where: { id: cId },
        data: { likes: { increment: 1 } },
      });

      return { liked: true, message: "Challenge liked" };
    }
  }

  async getChallenges() {
    try {
      const challenges = await this.prisma.challenge.findMany({
        include: {
          likesList: true,
        },
        orderBy: {
          id: 'desc',
        },
      });

      return challenges;
    } catch (error) {
      this.logger.error('Request failed:', error)
      throw new NotFoundException("Unable to get Challenges");
    }
  }

  async getChallengeById(challengeId: string) {
    const cId = Number(challengeId)

    if (isNaN(cId)) {
      throw new Error("Invalid challenge Id is not a number");
    }

    try {
      const challenge = await this.prisma.challenge.findUnique({
        where: {
          id: cId
        }
      })

      if (!challenge) {
        throw new NotFoundException('Challenge not found');
      }

      return challenge;
    } catch (error) {
      this.logger.error('Request failed:', error)
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  async createChallengeInstruction(dto: CreateChallengeInstructionDto) {
    if (!dto.challengeId) {
      throw new NotFoundException("Challenge not found!");
    }
    try {
      const challengeInstruction = await this.prisma.challengeInstructions.create({
        data: dto
      })
      return { "Message": "Solution creation was successfull" };
    } catch (error) {
      this.logger.error('Request failed:', error)
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getChallengeInstructions(challengeId: number) {
    return await this.prisma.challengeInstructions.findMany({
      where: {
        challengeId: challengeId
      }
    })
  }

  async updateChallengeInstruction(id: string, dto: any) {
    const instructionId = Number(id);

    if (isNaN(instructionId)) {
      return "Instruction id is not a number";
    }

    try {
      const updatedInstruction = await this.prisma.challengeInstructions.update({
        where: { id: instructionId },
        data: dto
      });

      return updatedInstruction;
    } catch (error) {
      this.logger.error('Request failed:', error);
      return "Failed to update instruction";
    }
  }

  async deleteChallengeInstruction(id: string) {
    const instructionId = Number(id);

    if (isNaN(instructionId)) {
      return "Instruction id is not a number";
    }

    try {
      await this.prisma.challengeInstructions.delete({
        where: { id: instructionId }
      });

      return { message: "Instruction deleted successfully" };
    } catch (error) {
      this.logger.error('Request failed:', error);
      return "Failed to delete instruction";
    }
  }

  async deleteChallenge(id: string) {
    const challengeId = Number(id);

    if (isNaN(challengeId)) {
      throw new BadRequestException("Challenge id is not a number");
    }

    try {
      // Optional: check if challenge exists first
      const existing = await this.prisma.challenge.findUnique({
        where: { id: challengeId },
      });

      if (!existing) {
        throw new NotFoundException("Challenge not found");
      }


      await this.prisma.challengeInstructions.deleteMany({ where: { challengeId } });
      await this.prisma.challengeSolutions.deleteMany({ where: { challengeId } });
      await this.prisma.completedChallenges.deleteMany({ where: { challengeId } });
      await this.prisma.challengeLike.deleteMany({ where: { challengeId } });

      await this.prisma.challenge.delete({
        where: { id: challengeId },
      });

      return { message: "Challenge deleted successfully" };
    } catch (error) {
      this.logger.error("Failed to delete challenge:", error);
      throw new HttpException(
        "Failed to delete challenge",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  async createChallengeSolution(dto: CreateChallengeSolutionDto) {
    const challenge = await this.prisma.challenge.findUnique({
      where: {
        id: dto.challengeId
      }
    })
    if (!challenge) {
      throw new NotFoundException("Challenge doesn't exists!");
    }

    if (!(Number(dto.challengeId))) {
      return "Challenge id should be number";
    }

    try {
      const challengeSolution = await this.prisma.challengeSolutions.create({
        data: dto
      })

      return { "Message": "Solution creation was successfull" };
    } catch (error) {
      this.logger.error('Request failed:', error);
      throw new HttpException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }



  async getChallengeSolution(challengeId: number) {
    const solution = await this.prisma.challengeSolutions.findMany({
      where: {
        challengeId: challengeId
      }
    })

    return solution;
  }

  async deleteChallengeSolution(id: number) {
    try {
      await this.prisma.challengeSolutions.delete({
        where: {
          id: id
        }
      })

      return {
        message: "Solution deleted successfully"
      }
    } catch (error) {
      console.log(error)
      throw new NotFoundException("Failed to delete")
    }
  }

  async updateSolution(dto: { id: number, solution: string }) {
    try {
      await this.prisma.challengeSolutions.update({
        where: {
          id: dto.id
        },
        data: {
          solution: dto.solution
        }
      })

      return {
        message: "Update successfull"
      }
    } catch (error) {
      console.log(error);
      throw new NotFoundException("Failed to delete solution");
    }
  }

  async createChallengeCompleter(dto: CreateChallengeCompleter) {
    if (!dto.userId || !dto.challengeId) {
      throw new BadRequestException("User ID and Challenge ID are required.");
    }
    const existing = await this.prisma.completedChallenges.findFirst({
      where: {
        userId: dto.userId,
        challengeId: dto.challengeId,
      }
    });
    if (existing) {
      throw new BadRequestException("Challenge already completed by this user.");
    }

    const challenge = await this.prisma.challenge.findUnique({
      where: { id: dto.challengeId }
    });

    return this.prisma.completedChallenges.create({
      data: {
        userId: dto.userId,
        challengeId: dto.challengeId,
        userSolution: dto.solution,
        url: dto.url,
        marks: 0,
        createdAt: new Date(),
      }
    });
  }

  async completeStep(instructionId: number) {

    const instruction = await this.prisma.challengeInstructions.findUnique({
      where: {
        id: instructionId
      }
    })

    if (instruction?.completed === false) {
      const challengeInstructionCompletion = await this.prisma.challengeInstructions.update({
        where: {
          id: instructionId
        },
        data: {
          completed: true,
        }
      })

      return challengeInstructionCompletion

    } else {
      const challengeInstructionUnCompletion = await this.prisma.challengeInstructions.update({
        where: {
          id: instructionId
        },
        data: {
          completed: false,
        }
      })

      return challengeInstructionUnCompletion

    }
  }

  async getLeaderboard() {
    try {
      // Group by userId and sum marks
      const leaderboard = await this.prisma.completedChallenges.groupBy({
        by: ['userId'],
        _sum: {
          marks: true,
        },
        orderBy: {
          _sum: {
            marks: 'desc',
          },
        },
      });

      // Fetch user details for each entry
      const leaderboardWithUsers = await Promise.all(
        leaderboard.map(async (entry) => {
          const user = await this.prisma.user.findUnique({
            where: { id: entry.userId },
            select: { id: true, username: true, email: true, photo: true },
          });
          return {
            user,
            totalMarks: entry._sum.marks || 0,
          };
        })
      );

      return leaderboardWithUsers;
    } catch (error) {
      this.logger.error('Failed to get leaderboard:', error);
      throw new HttpException("Failed to get leaderboard", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
