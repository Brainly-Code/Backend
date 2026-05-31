/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ChallengeInstructionsService } from './challenge-instructions.service';
import { ChallengeInstructionsController } from './challenge-instructions.controller';

@Module({
  providers: [ChallengeInstructionsService],
  controllers: [ChallengeInstructionsController]
})
export class ChallengeInstructionsModule {}
