/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateLessonDto, CreateLessonProgressDto, TrackLessonProgressDto } from './dto';

@Injectable()
export class LessonService {
  private readonly Logger = new Logger(LessonService.name);
  constructor(private prisma: PrismaService) {}

  async createLesson(dto: CreateLessonDto) {
    try {
      // 1. Get the highest lesson number under the same miniModuleId
      const lastLesson = await this.prisma.lesson.findFirst({
        where: {
          miniModuleId: dto.miniModuleId,
        },
        orderBy: {
          number: 'desc',
        },
      });

      // 2. Determine the next number
      const nextNumber = lastLesson ? lastLesson.number + 1 : 1;

      // 3. Create the lesson
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

        // 4. Find the Course related to this lesson
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
          // 5. Count all lessons in this course
          const totalLessons = await this.prisma.lesson.count({
            where: {
              miniModule: {
                courseModule: {
                  courseId: course.id,
                },
              },
            },
          });
          const totalLessonsDuration = `${totalLessons}`;

          // 6. Update course duration with the total number of lessons
          await this.prisma.course.update({
            where: { id: course.id },
            data: { duration: totalLessonsDuration },
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
