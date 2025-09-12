import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CourseResourceService } from './course-resource.service';
import { CourseResourceController } from './course-resource.controller';

@Module({
  controllers: [CourseResourceController],
  providers: [CourseResourceService, PrismaService],
})
export class CourseResourceModule {}
