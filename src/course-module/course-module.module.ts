/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ModuleController } from './course-module.controller';
import { ModuleService } from './course-module.service';

@Module({
  controllers: [ModuleController],
  providers: [ModuleService]
})
export class CourseModuleModule {}
