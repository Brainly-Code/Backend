import { Controller, Post, Get, Param, Delete, UploadedFile, UseInterceptors, Body, UseGuards } from '@nestjs/common';
import { LessonVideoService } from './lesson-video.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateLessonVideoDto } from './dto';
import { AdminGuard, JwtGuard } from '../guard';

@Controller('lesson-videos')
export class LessonVideoController {
  constructor(private readonly lessonVideoService: LessonVideoService) { }

  @UseGuards(JwtGuard, AdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(@Body() body: CreateLessonVideoDto, @UploadedFile() file: Express.Multer.File) {
    console.log('Incoming body:', body);
    console.log('Incoming file:', file);
    return this.lessonVideoService.create(body, file);
  }
  @UseGuards(JwtGuard)
  @Get()
  async findAll() {
    return this.lessonVideoService.findAll();
  }

  @UseGuards(JwtGuard)
  @Get('mini-module/:miniModuleId')
  async findByMiniModule(@Param('miniModuleId') miniModuleId: number) {
    return this.lessonVideoService.findByMiniModule(Number(miniModuleId));
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  async getLessonVideoById(@Param('id') id: string) {
    return this.lessonVideoService.findById(Number(id));
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.lessonVideoService.remove(Number(id));
  }
}
