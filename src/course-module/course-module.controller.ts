import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ModuleService } from './course-module.service';
import { CreateCourseModuleDto, CreateModuleProgressDto } from './dto';
import { AdminGuard, JwtGuard } from '../guard';

@Controller('modules')
export class ModuleController {
  constructor(private moduleService: ModuleService) { }

  @UseGuards(JwtGuard, AdminGuard)
  @Post()
  createModule(@Body() dto: CreateCourseModuleDto) {
    return this.moduleService.createModule(dto);
  }

  @UseGuards(JwtGuard)
  @Get()
  getModules() {
    return this.moduleService.getModules();
  }

  @UseGuards(JwtGuard)
  @Get('/:id')
  getModulesPerCourse(@Param('id') id: string) {
    return this.moduleService.getModulesPerCourse(id);
  }

  @UseGuards(JwtGuard)
  @Post('/progress')
  createModuleProgress(@Body() dto: CreateModuleProgressDto) {
    return this.moduleService.createModuleProgress(dto);
  }

  @UseGuards(JwtGuard)
  @Patch('/progress/:id')
  trackModuleProgress(@Param('id') id: number, @Body() moduleId: number) {
    return this.moduleService.trackModuleProgress(id, moduleId);
  }

  @UseGuards(JwtGuard)
  @Get('/progress/:moduleId')
  GetLessonProgress(@Param('moduleId') moduleId: number) {
    if (isNaN(moduleId)) {
      throw new Error("Invalid lessonId, should be number");
    }

    return this.moduleService.getLessonProgress(moduleId);
  }
}
