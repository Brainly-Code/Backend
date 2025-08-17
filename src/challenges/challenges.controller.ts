/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/createChallenge.dto';
import { CreateChallengeInstructionDto, CreateChallengeSolutionDto } from './dto';

@Controller('challenges')
export class ChallengesController {
  constructor( private challengeService: ChallengesService ){}
  
  @Post()
  createChallenge(@Body() dto: CreateChallengeDto) {
    return this.challengeService.createChallenge(dto);
  }
  
  @Post('like/:id')
  incrementLikes(@Param('id') id: string) {
    return this.challengeService.incrementLikes(id);
  }

  @Get('')
  getChallenges() {
    return this.challengeService.getChallenges();
  }

  @Get('/:id')
  getChallengeById(@Param('id') id: string){
    return this.challengeService.getChallengeById(id);
  }

  @Post('/instruction')
  createChallengeInstruction(@Body() dto: CreateChallengeInstructionDto) {
    return this.challengeService.createChallengeInstruction(dto)
  }

  @Get('/instruction/:challengeId')
  getChallengeInstruction( @Param('challengeId') challengeId: number ) {
    if(isNaN(challengeId)) {
      throw new BadRequestException("Invalid ChallengeId, must be number")
    }

    return this.challengeService.getChallengeInstructions(challengeId)
  }

  @Post('solution')
  createChallengeSolution(@Body() dto: CreateChallengeSolutionDto) {
    return this.challengeService.createChallengeSolution(dto)
  }

  @Get('/solution/:challengeId')
  getChallengeSolution( @Param('challengeId') challengeId: number ) {
    if(isNaN(challengeId)) {
      throw new BadRequestException("Invalid ChallengeId, must be number")
    }

    return this.challengeService.getChallengeSolution(challengeId)
  }
}
