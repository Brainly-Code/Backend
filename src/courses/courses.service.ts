/* eslint-disable prettier/prettier */
import { BadRequestException, ForbiddenException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateCourseDto, CreateUserCourseProgressDto } from "./dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);
  constructor(private prisma: PrismaService) {}

  async createCourse(dto: CreateCourseDto, creatorId: number) {
    try {
    const course = await this.prisma.course.create({
      data: {
        ...dto,
        creator: {
          connect: { id: creatorId },
        },
      },
      select: {
        id: true,
        title: true,
        category: true,
        creatorId: true,
        createdAt: true,
      },
    });

    return {
      message: "Course Created successfully",
      course: course,
    }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ForbiddenException("Course already exists");
        }
      }
      throw error;
    }
  }

    async getCoursesByCreator(creatorId: number) {
      console.log(creatorId)
    return this.prisma.course.findMany({
      where: {
        creatorId,
      },
      orderBy: {
        createdAt: 'desc', // optional: latest first
      },
      select: {
        id: true,
        title: true,
        category: true,
        createdAt: true,
        description: true,
        duration: true,
        studentsCount: true,
        rating: true,
        level: true,
        likes:true,
        completions: true
        // include other fields if needed
      },
    });
  }

async getCourseById(courseId: number) {
  // No need to parse or check NaN anymore
  const course = await this.prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course) {
    throw new Error("Course not found");
  }

  return course;
}


  async getCourses() {
    return this.prisma.course.findMany();
  }

async likeCourse(courseId: number, userId: number) {
  const existingLike = await this.prisma.courseLike.findUnique({
    where: {
      userId_courseId: { userId, courseId },
    },
  });

  if (existingLike) {
    // Unlike: delete entry & decrement likes
    await this.prisma.courseLike.delete({
      where: { userId_courseId: { userId, courseId } },
    });

    await this.prisma.course.update({
      where: { id: courseId },
      data: { likes: { decrement: 1 } },
    });

    return { liked: false };
  } else {
    // Like: create entry & increment likes
    await this.prisma.courseLike.create({
      data: { userId, courseId },
    });

    await this.prisma.course.update({
      where: { id: courseId },
      data: { likes: { increment: 1 } },
    });

    return { liked: true };
  }
}

  async getUserLikedCourses(userId: number) {
    const liked = await this.prisma.courseLike.findMany({
      where: { userId },
      select: { courseId: true },
    });
    return liked.map((like) => like.courseId);
  }


  async createUserCourseProgress(dto: CreateUserCourseProgressDto): Promise<{message: string, data: object}> {
    const user = await this.prisma.user.findUnique({ where: { id: dto.userId } });
    if (!user) {
      throw new NotFoundException(`User not found`);
    }

    const course = await this.prisma.course.findUnique({ where: { id: dto.courseId } });
    if (!course) {
      throw new NotFoundException(`Course not found`);
    }

    try {
      const userCourseProgress = await this.prisma.userCourseProgress.create({
        data: {
          user: { connect: { id: dto.userId } },
          course: { connect: { id: dto.courseId } },
          currentStep: dto.currentStep ?? 0,
          completed: dto.completed ?? false,
          rating: dto.rating,
        },
      });
      return {
        "message": "The course progress has started being traced",
        data: userCourseProgress,
      };
    } catch (error) {
      this.logger.error(error);
      throw new BadRequestException('Failed to create user course progress');
    }
  }

  async trackUserCourseProgress(id: number, courseId: number) {
    const courseModules = await this.prisma.courseModule.findMany({
      where: {
        courseId: courseId,
      },
    });

    const videos = await this.prisma.video.findMany({
      where: {
        courseId: courseId,
      },
    })
  
    const totalSteps = courseModules.length + videos.length;
  
    if (totalSteps === 0) {
      throw new Error("This course has no modules.");
    }
  
    const courseProgress = await this.prisma.userCourseProgress.findUnique({
      where: { id: id },
    });
  
    if (!courseProgress) {
      throw new Error("Progress not found.");
    }
  
    let nextStep = courseProgress.currentStep + 1;
  
    if (nextStep > totalSteps) {
      nextStep = totalSteps;
    }
  
    const percent = Math.round((nextStep / totalSteps) * 100);
  
    await this.prisma.userCourseProgress.update({
      where: { id: id },
      data: {
        currentStep: nextStep,
      },
    });
  
    if (percent === 100) {
      await this.prisma.userCourseProgress.update({
        where: {
          id: id,
        }, 
        data: {
          completed: true,
        }
      })
      return {
        message: "Course complete",
        percentComplete: percent,
        step: nextStep,
        totalSteps: totalSteps,
      };
    }
  
    return {
      message: "New step started",
      percentComplete: percent,
      step: nextStep,
      totalSteps: totalSteps,
    };
  }

  async getCourseProgress(courseId: number) {
    if(isNaN(courseId)) {
      throw new BadRequestException("Invalid courseId, should be a number");
    }
    try {
      const courseProgress = await this.prisma.userCourseProgress.findMany({
        where: {
          courseId: courseId,
        }
      })
  
      return {data: courseProgress};
    } catch (error) {
      console.log(error)
      throw new NotFoundException("Progress not found");
    }
  }
  
  
  async deleteCourse(courseId: number) {
  const course = await this.prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          miniModules: {
            include: {
              lessons: {
                include: {
                  solutions: true,
                },
              },
              lessonVideos: true,
            },
          },
        },
      },
      videos: true,
      progress: true,
      ratings: true,
    },
  });

  if (!course) throw new Error("Course not found");

  // Delete LessonSolutions
  for (const module of course.modules) {
    for (const miniModule of module.miniModules) {
      for (const lesson of miniModule.lessons) {
        await this.prisma.lessonSolution.deleteMany({
          where: { lessonId: lesson.id },
        });
      }
    }
  }

  // Delete Lessons
  for (const module of course.modules) {
    for (const miniModule of module.miniModules) {
      await this.prisma.lesson.deleteMany({
        where: { miniModuleId: miniModule.id },
      });
    }
  }

  // Delete LessonVideos
  for (const module of course.modules) {
    for (const miniModule of module.miniModules) {
      await this.prisma.lessonVideo.deleteMany({
        where: { miniModuleId: miniModule.id },
      });
    }
  }

  // Delete MiniModules
  for (const module of course.modules) {
    await this.prisma.miniModule.deleteMany({
      where: { courseModuleId: module.id },
    });
  }

  // Delete CourseModules
  await this.prisma.courseModule.deleteMany({
    where: { courseId: course.id },
  });

  // Delete Videos
  await this.prisma.video.deleteMany({
    where: { courseId: course.id },
  });

  // Delete Ratings
  await this.prisma.courseRating.deleteMany({
    where: { courseId: course.id },
  });

  // Delete Progress
  await this.prisma.userCourseProgress.deleteMany({
    where: { courseId: course.id },
  });

  // Finally, delete the course
  await this.prisma.course.delete({
    where: { id: course.id },
  });

  return { message: "Course and all related data deleted successfully." };
}

}
