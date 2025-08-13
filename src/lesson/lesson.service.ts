/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonDto, CreateLessonProgressDto, CreateLessonSolutionDto, TrackLessonProgressDto } from './dto';

@Injectable()
export class LessonService {
  private readonly Logger = new Logger(LessonService.name);
  constructor(private prisma: PrismaService) {}

  async createLesson(dto: CreateLessonDto) {
  try {
    // 1. Get the highest lesson number in the same miniModule
    const highestLesson = await this.prisma.lesson.findFirst({
      where: {
        miniModuleId: dto.miniModuleId,
      },
      orderBy: {
        number: 'desc',
      },
    });

    // 2. Get the highest lessonVideo number in the same miniModule
    const highestVideo = await this.prisma.lessonVideo.findFirst({
      where: {
        miniModuleId: dto.miniModuleId,
      },
      orderBy: {
        number: 'desc',
      },
    });

    // 3. Calculate the next available number
    const lessonNumber = highestLesson?.number || 0;
    const videoNumber = highestVideo?.number || 0;
    const nextNumber = Math.max(lessonNumber, videoNumber) + 1;

    // 4. Create the lesson
    const lesson = await this.prisma.lesson.create({
      data: {
        miniModuleId: dto.miniModuleId,
        title: dto.title,
        explanation: dto.explanation,
        more: dto.more,
        example: dto.example,
        note: dto.note,
        assignment: dto.assignment,
        number: nextNumber,
      },
    });

    // 5. Find the related course
    const course = await this.prisma.course.findFirst({
      where: {
        modules: {
          some: {
            miniModules: {
              some: {
                lessons: {
                  some: {
                    id: lesson.id,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (course) {
      // 6. Count total lessons in the course
      const totalLessons = await this.prisma.lesson.count({
        where: {
          miniModule: {
            courseModule: {
              courseId: course.id,
            },
          },
        },
      });

      // 7. Update course duration with the number of lessons
      await this.prisma.course.update({
        where: { id: course.id },
        data: { duration: `${totalLessons}` },
      });
    }

    return lesson;
  } catch (error) {
    console.error(error);
    throw error;
  }
}





  async getLessonsPerMiniModule(miniModuleId: string) {
    try {
      const mMID = Number(miniModuleId);

      if(isNaN(mMID)){
        return "The minimoduleid provided is not a number";
      }
  
      const lessonsPerMiniModule = await this.prisma.lesson.findMany({
        where: {
          miniModuleId: mMID,
        }
      })
  
      return lessonsPerMiniModule;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getLessons() {
    try {
      const lessons = await this.prisma.lesson.findMany();

      return lessons;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getLessonById(id: string) {
    try {
      const lessonId = Number(id);

      if(isNaN(lessonId)){
        return "The lessonId provided is not a number";
      }

      const lesson = await this.prisma.lesson.findUnique({
        where: {
          id: lessonId,
        }
      })

      return lesson;
    } catch (error) {
      console.log(error)
      return error;
    }
  }

  async createLessonProgress(dto: CreateLessonProgressDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: dto.userId,
      }
    });

    if(!user) {
      throw new NotFoundException("User does not exist");
    }

    const lesson = await this.prisma.miniModule.findUnique({
      where: {
        id: dto.lessonId,
      }
    });

    if(!lesson) {
      throw new NotFoundException("User does not exist");
    }

    try {
      const lessonProgress = await this.prisma.userLessonProgress.create({
        data: dto,
      })

      return {
        message: "Tracking miniModuleProgress",
        data: lessonProgress,
      }
    } catch (error) {
      this.Logger.error(error);
      throw new HttpException("Unable to create progress", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async trackLessonProgress(id: number, dto: TrackLessonProgressDto) {
    console.log(dto.lessonId);
    const solutions = await this.prisma.lessonSolution.findMany({
      where: {
        lessonId: dto.lessonId,
      }
    })

    const totalSteps = solutions.length;
    const lessonProgress = await this.prisma.userLessonProgress.findUnique({
      where: {
        id: id,
      }
    });

    if(!lessonProgress) {
      throw new NotFoundException("MiniModule not found");
    }
    const nextStep = lessonProgress.currentStep + 1;

    let percentage = Math.round(( nextStep / totalSteps ) * 100);
    if(!percentage) {
      percentage = 0;
    }

    try {
      const updatedProgress = await this.prisma.userLessonProgress.update({
        where: {
          id: id
        }, 
        data: {
          currentStep: nextStep,
        }
      })

      if(updatedProgress.currentStep === totalSteps) {
        await this.prisma.userLessonProgress.update({
          where: {
            id: id,
          },
          data: {
            completed: true,
          }
        })
        return {
          message: "Lesson complete",
          percentage: percentage,
          Lessons: totalSteps,
          currentStep: updatedProgress.currentStep
        }
      }

      return {
        message: "Tracking progress",
        percentage: percentage,
        currentStep: updatedProgress.currentStep,
        Lessons: totalSteps
      }
    } catch (error) {
      this.Logger.error(error)
      throw new HttpException("Unable to create progress", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getLessonProgress(lessonId: number) {
    if(isNaN(lessonId)) {
      throw new BadRequestException("Invalid lessonId, should be a number");
    }
    try {
      const lessonProgress = await this.prisma.userLessonProgress.findMany({
        where: {
          lessonId: lessonId,
        }
      })
  
      return {data: lessonProgress};
    } catch (error) {
      console.log(error)
      throw new NotFoundException("Progress not found");
    }
  }

  async createLessonSolution(dto: CreateLessonSolutionDto) {
    const lesson = await this.prisma.lesson.findUnique({
      where: {
        id: dto.lessonId
      }
    })
    if(!lesson) {
      throw new NotFoundException("Lesson Not Found")
    }
    
    try {
      const lessonSolution =  await this.prisma.lessonSolution.create({
        data: dto
      })
    
      return {
        message: "Solution created successfully",
        data: lessonSolution
      }
    } catch (error) {
      this.Logger.error(error);
      throw new HttpException("Unable to create progress", HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  async getLessonSolution(lessonId: number) {
    
    try {
      const lessonSolution = await this.prisma.lessonSolution.findUnique({
        where: {
          lessonId: lessonId,
        }
      });
      if(!lessonSolution) {
        throw new Error("Solution Not Found");
      }
      return lessonSolution;
    } catch (error) {
      console.log(error);
      throw new NotFoundException("solution not found");
    }

  }
}
