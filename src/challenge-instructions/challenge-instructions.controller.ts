/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { ChallengeInstructionsService } from './challenge-instructions.service';
import { createChallengeInstructionDto, updateChallengeInstructionDto } from './dto';

@Controller('challenge-instructions')
export class ChallengeInstructionsController {
  constructor(private challengeInstructionsService: ChallengeInstructionsService) {}

  @Post('')
  createChallengeInstruction (@Body() dto: createChallengeInstructionDto ) {
    return this.challengeInstructionsService.createChallengeInstruction(dto);
  }

  @Get('/:challengeId')
  getInstructionsForChallenge(@Param('challengeId') challengeId: string) {
    return this.challengeInstructionsService.getInstructionsForChallenge(challengeId);
  }

  @Put('/:id')
  updateChallengeInstruction(@Param('id') id: string, @Body() dto: updateChallengeInstructionDto) {
    return this.challengeInstructionsService.updateChallengeInstruction(id, dto);
  }

  @Delete('/:id')
  deleteChallengeInstruction(@Param('id') id: string) {
    return this.challengeInstructionsService.deleteChallengeInstruction(id);
  }
}
