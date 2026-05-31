/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { PrismaModule } from '../prisma/prisma.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    MulterModule.register(),
    CloudinaryModule, 
    PrismaModule
  ],
  providers: [VideoService],
  controllers: [VideoController],
})
export class VideoModule {}