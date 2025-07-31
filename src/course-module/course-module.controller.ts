/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ModuleService } from './course-module.service';
import { CreateCourseModuleDto, CreateModuleProgressDto } from './dto';

@Controller('modules')
export class ModuleController {
  constructor(private moduleService: ModuleService){}
  
  @Post()
  createModule(@Body() dto: CreateCourseModuleDto) {
    return this.moduleService.createModule(dto);
  }

  @Get()
  getModules() {
    return this.moduleService.getModules();
  }

  @Get('/:id')
  getModulesPerCourse(@Param('id') id: string) {
    return this.moduleService.getModulesPerCourse(id);
  }

  @Post('/progress')
  createModuleProgress(@Body() dto: CreateModuleProgressDto) {
    return this.moduleService.createModuleProgress(dto);
  }

  @Patch('/progress/:id')
  trackModuleProgress(@Param('id') id: number, @Body() moduleId: number) {
    return this.moduleService.trackModuleProgress(id, moduleId);
  }

  @Get('/progress/:moduleId')
  GetLessonProgress(@Param('moduleId') moduleId: number) {
    if(isNaN(moduleId)) {
      throw new Error("Invalid lessonId, should be number");
    }

    return this.moduleService.getLessonProgress(moduleId);
  }
}
