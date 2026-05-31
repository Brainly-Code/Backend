/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';

@Module({
  imports: [ConfigModule],  // loads .env variables
  providers: [CloudinaryService],
  exports: [CloudinaryService], // so other modules can use it
})
export class CloudinaryModule {}
