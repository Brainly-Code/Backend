/* eslint-disable prettier/prettier */
import { Controller, Post, Get, Param, Delete, UploadedFile, UseInterceptors, Body } from '@nestjs/common';
import { LessonVideoService } from './lesson-video.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateLessonVideoDto } from './dto';

@Controller('lesson-videos')
export class LessonVideoController {
  constructor(private readonly lessonVideoService: LessonVideoService) {}

@Post()
@UseInterceptors(FileInterceptor('file'))
async create(@Body() body: CreateLessonVideoDto, @UploadedFile() file: Express.Multer.File) {
  console.log('Incoming body:', body);
  console.log('Incoming file:', file);
  return this.lessonVideoService.create(body, file);
}
  @Get()
  async findAll() {
    return this.lessonVideoService.findAll();
  }

  @Get('mini-module/:miniModuleId')
  async findByMiniModule(@Param('miniModuleId') miniModuleId: number) {
    return this.lessonVideoService.findByMiniModule(Number(miniModuleId));
  }

  @Get(':id')
  async getLessonVideoById(@Param('id') id: string) {
    return this.lessonVideoService.findById(Number(id));
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.lessonVideoService.remove(Number(id));
  }
}
