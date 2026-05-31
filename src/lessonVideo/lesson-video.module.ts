import { Module } from '@nestjs/common';
import { LessonVideoService } from './lesson-video.service';
import { LessonVideoController } from './lesson-video.controller';
import { PrismaService } from '../prisma/prisma.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Module({
  controllers: [LessonVideoController],
  providers: [LessonVideoService, PrismaService, CloudinaryService],
})
export class LessonVideoModule {}
