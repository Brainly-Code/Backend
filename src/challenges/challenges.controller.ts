/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/createChallenge.dto';
import { CreateChallengeCompleter, CreateChallengeInstructionDto, CreateChallengeSolutionDto } from './dto';

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
    return this.challengeService.getChallengeById(id)
  }

  @Put('/:id')
  updateChallenge(@Param('id') id: string, @Body() dto: any) {
    return this.challengeService.updateChallenge(id, dto)
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

  @Put('/instruction/:id')
  updateChallengeInstruction(@Param('id') id: string, @Body() dto: any) {
    return this.challengeService.updateChallengeInstruction(id, dto)
  }

  @Delete('/instruction/:id')
  deleteChallengeInstruction(@Param('id') id: string) {
    return this.challengeService.deleteChallengeInstruction(id)
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

  @Post('/challenge-completer')
  createChallengeCompleter(@Body() dto: CreateChallengeCompleter) {
    return this.challengeService.createChallengeCompleter(dto);
  } 

  @Post('/challenge-instruction/:instructionId')
  completeInstruction (@Param('instructionId') instructionId: number) {
    return this.challengeService.completeStep(instructionId);
  }

}
