import { Body, Controller, Get, Param, Post, Put, Delete, UseGuards } from '@nestjs/common';
import { ChallengeInstructionsService } from './challenge-instructions.service';
import { createChallengeInstructionDto, updateChallengeInstructionDto } from './dto';
import { AdminGuard, JwtGuard } from '../guard';

@Controller('challenge-instructions')
export class ChallengeInstructionsController {
  constructor(private challengeInstructionsService: ChallengeInstructionsService) { }

  @UseGuards(JwtGuard, AdminGuard)
  @Post('')
  createChallengeInstruction(@Body() dto: createChallengeInstructionDto) {
    return this.challengeInstructionsService.createChallengeInstruction(dto);
  }

  @UseGuards(JwtGuard)
  @Get('/:challengeId')
  getInstructionsForChallenge(@Param('challengeId') challengeId: string) {
    return this.challengeInstructionsService.getInstructionsForChallenge(challengeId);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Put('/:id')
  updateChallengeInstruction(@Param('id') id: string, @Body() dto: updateChallengeInstructionDto) {
    return this.challengeInstructionsService.updateChallengeInstruction(id, dto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete('/:id')
  deleteChallengeInstruction(@Param('id') id: string) {
    return this.challengeInstructionsService.deleteChallengeInstruction(id);
  }
}
