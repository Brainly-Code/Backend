/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/createChallenge.dto';

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
}
