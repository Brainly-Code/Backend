/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ChallengesController } from './challenges.controller';
import { ChallengesService } from './challenges.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';


@Module({
  imports: [PrismaModule,CloudinaryModule],
  controllers: [ChallengesController],
  providers: [ChallengesService],
})

export class ChallengesModule {}
