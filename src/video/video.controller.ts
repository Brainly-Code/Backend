import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Delete,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto';
import { AdminGuard, JwtGuard } from '../guard';

@Controller('videos')
export class VideoController {
  constructor(private readonly videoService: VideoService) { }

  @UseGuards(JwtGuard, AdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    limits: {
      fileSize: 100 * 1024 * 1024, // 100 MB max, adjust as needed
    },
  }))
  create(
    @Body() createVideoDto: CreateVideoDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    console.log("UPLOADED FILE:", file);
    return this.videoService.create(createVideoDto, file);
  }

  @UseGuards(JwtGuard)
  @Get()
  findByCourse(@Query('courseId') courseId: string) {
    return this.videoService.findByCourseId(Number(courseId));
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.videoService.findOne(id);
  }


  @UseGuards(JwtGuard, AdminGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.videoService.remove(id);
  }
}
