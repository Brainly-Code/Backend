/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMiniModuleDto } from './dto';
import { CreateMiniModuleProgressDto } from './dto/createMiniModuleProgress.dto';

@Injectable()
export class MiniModuleService {
  private readonly Logger = new Logger(MiniModuleService.name);
  constructor(private prisma: PrismaService) {}

    async createMiniModule(dto: CreateMiniModuleDto) {
    try {
      // 1. Get the highest number for miniModules under the same courseModuleId
      const lastMiniModule = await this.prisma.miniModule.findFirst({
        where: {
          courseModuleId: dto.courseModuleId,
        },
        orderBy: {
          number: 'desc',
        },
      });

      // 2. Auto-increment number
      const nextNumber = lastMiniModule ? lastMiniModule.number + 1 : 1;

      // 3. Create the miniModule with the auto-incremented number
      const miniModule = await this.prisma.miniModule.create({
        data: {
          courseModuleId: dto.courseModuleId,
          title: dto.title,
          number: nextNumber,
        },
      });

      return {
        message: "Mini module successfully created",
        data: miniModule
      };
    } catch (error) {
      this.Logger.error(error);
      throw new HttpException("Unable to create progress", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async getMiniModulesPerCourseModule(courseModuleId: string) {
    const cMID = Number(courseModuleId);

    if(isNaN(cMID)) {
      throw new Error("courseModuleId is invalid, should be a number");
    }

    const miniModulesPerCourseModule = await this.prisma.miniModule.findMany({
      where: {
        courseModuleId: cMID
      },
      include: {
        lessons: true,
      }
    })

    if(!miniModulesPerCourseModule) {
      throw new NotFoundException("MiniModules not found");
    }

    return miniModulesPerCourseModule;
  }

  async createminiModuleProgress(dto: CreateMiniModuleProgressDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: dto.userId,
      }
    });

    if(!user) {
      throw new NotFoundException("User does not exist");
    }

    const miniModule = await this.prisma.miniModule.findUnique({
      where: {
        id: dto.miniModuleId,
      }
    });

    if(!miniModule) {
      throw new NotFoundException("User does not exist");
    }

    try {
      const miniModuleProgress = await this.prisma.miniModuleProgress.create({
        data: dto,
      })

      return {
        message: "Tracking miniModuleProgress",
        data: miniModuleProgress,
      }
    } catch (error) {
      this.Logger.error(error);
      throw new HttpException("Unable to create progress", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async trackMiniModuleProgress(id: number, miniModuleId: number) {
    const miniModuleLessons = await this.prisma.lesson.findMany({
      where: {
        miniModuleId: miniModuleId
      }
    });

    const lessonVideos = await this.prisma.lessonVideo.findMany({
      where: {
        miniModuleId: miniModuleId,
      }
    })

    const totalSteps = miniModuleLessons.length + lessonVideos.length;
    const miniModuleProgress = await this.prisma.miniModuleProgress.findUnique({
      where: {
        id: id,
      }
    });

    if(!miniModuleProgress) {
      throw new NotFoundException("MiniModule not found");
    }
    const nextStep = miniModuleProgress.currentStep + 1;

    const percentage = Math.round(( nextStep / totalSteps ) * 100);

    try {
      const updatedProgress = await this.prisma.miniModuleProgress.update({
        where: {
          id: id
        }, 
        data: {
          currentStep: nextStep,
        }
      })

      if(updatedProgress.currentStep === totalSteps) {
        await this.prisma.miniModuleProgress.update({
          where: {
            id: id,
          },
          data: {
            completed: true,
          }
        })
        return {
          message: "miniModule complete",
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

  async getMiniModuleProgress(miniModuleId: number) {
    if(isNaN(miniModuleId)) {
      throw new BadRequestException("Invalid lessonId, should be a number");
    }
    try {
      const miniModuleProgress = await this.prisma.miniModuleProgress.findMany({
        where: {
          miniModuleId: miniModuleId,
        }
      })
  
      return {data: miniModuleProgress};
    } catch (error) {
      console.log(error)
      throw new NotFoundException("Progress not found");
    }
  }
}
