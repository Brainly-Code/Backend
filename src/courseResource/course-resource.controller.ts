import { Controller, Post, Get, Delete, Param, UploadedFile, UseInterceptors, Body, UseGuards, ParseIntPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CourseResourceService } from './course-resource.service';
import { CreateCourseResourceDto } from './dto/create-course-resource.dto';
import { AdminGuard, JwtGuard } from '../guard';

@Controller('resources')
export class CourseResourceController {
  constructor(private service: CourseResourceService) { }

  @UseGuards(JwtGuard, AdminGuard)
  @Post(':courseId')
  @UseInterceptors(FileInterceptor('file'))
  async uploadResource(
    @Param('courseId', ParseIntPipe) courseId: number,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateCourseResourceDto,
  ) {
    return this.service.uploadResource(file, dto, courseId);
  }

  @UseGuards(JwtGuard)
  @Get(':courseId')
  async getResources(@Param('courseId', ParseIntPipe) courseId: number) {
    return this.service.getResourcesByCourse(courseId);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete(':resourceId')
  async deleteResource(@Param('resourceId', ParseIntPipe) resourceId: number) {
    return this.service.deleteResource(resourceId);
  }
}
