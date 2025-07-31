/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCourseModuleDto, CreateModuleProgressDto } from './dto';

@Injectable()
export class ModuleService {
  private readonly Logger = new Logger(ModuleService.name);
  constructor(private prisma: PrismaService) {}

  async createModule(dto: CreateCourseModuleDto) {
    try {
      // Step 1: Get the highest current module number for the courseId
      const lastModule = await this.prisma.courseModule.findFirst({
        where: { courseId: dto.courseId },
        orderBy: { number: 'desc' },
      });

      const nextNumber = (lastModule?.number || 0) + 1;

      // Step 2: Create new module with incremented number
      const courseModule = await this.prisma.courseModule.create({
        data: {
          courseId: dto.courseId,
          title: dto.title,
          number: nextNumber,
        },
      });

      return courseModule;

    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async getModules() {
    return await this.prisma.courseModule.findMany();
  }

  async getModulesPerCourse(courseId: string) {
    const cId = Number(courseId);
    if (isNaN(cId)) {
      return "CourseId is not a number";
    }

    const modulesPerCourse = await this.prisma.courseModule.findMany({
      where: {
        courseId: cId,
      },
      include: {
        miniModules: true,
      },
    });

    if (!modulesPerCourse || modulesPerCourse.length === 0) {
      return "Modules not found!";
    }

    return modulesPerCourse;
  }

  async createModuleProgress(dto: CreateModuleProgressDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        id: dto.userId,
      }
    })

    if(!user) {
      throw new NotFoundException("User Does not exist");
    }
    const module = await this.prisma.courseModule.findFirst({
      where: {
        id: dto.courseModuleId,
      }
    })

    if(!module) {
      throw new NotFoundException("Module not found");
    }

    try {
      const moduleProgress  =  await this.prisma.userModuleProgress.create({data: dto});

      return {
        message: "Module progress started",
        data: moduleProgress
      }
    } catch (error) {
      this.Logger.error(error);
      throw new HttpException("Unable to create module: ", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async trackModuleProgress( id: number, moduleId: number ) {
    const miniModules = await this.prisma.miniModule.findMany({
      where: {
        courseModuleId: moduleId,
      }
    })

    const totalSteps = miniModules.length;

    const moduleProgress = await this.prisma.userModuleProgress.findUnique({
      where: {
        id: id
      }
    })

    console.log()
    if(!moduleProgress){
      throw new NotFoundException("Moduleprogress not found");
    }

    let nextStep = moduleProgress?.currentStep + 1;

    if(nextStep > totalSteps) {
      nextStep = totalSteps;
    }

    const percentage = Math.round((nextStep / totalSteps) * 100);

    const updatedProgress = await this.prisma.userModuleProgress.update({
      where: {
        id: id,
      },
      data: {
        currentStep: nextStep,
      }
    })

    try {
      if(percentage === 100) {
        await this.prisma.userCourseProgress.update({
          where: {
            id: id,
          },
          data: {
            completed: true,
          }
        })
        return {
          message: "Module completed",
          percentage: percentage,
          currentStep: nextStep,
          numberOfMiniModules: totalSteps,
        }
  
      }
  
      return {
        message: "tracking ModuleProgress",
        percentage: percentage,
        currentStep: updatedProgress?.currentStep,
        numberOfMiniModules: totalSteps,
      }
    } catch (error) {
      this.Logger.error(error);
      throw new HttpException("Unable track progress: ", HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getLessonProgress(moduleId: number) {
    if(isNaN(moduleId)) {
      throw new BadRequestException("Invalid lessonId, should be a number");
    }
    try {
      const moduleProgress = await this.prisma.userModuleProgress.findMany({
        where: {
          courseModuleId: moduleId,
        }
      })
  
      return {data: moduleProgress};
    } catch (error) {
      console.log(error)
      throw new NotFoundException("Progress not found");
    }
  }
}
