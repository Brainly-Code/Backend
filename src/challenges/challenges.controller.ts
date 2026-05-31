/* eslint-disable prettier/prettier */
import { BadRequestException, Body, Controller, Get, Param, Patch, Post, Put, Delete, UseInterceptors, UploadedFile, UseGuards, NotFoundException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { ChallengesService } from './challenges.service';
import { CreateChallengeDto } from './dto/createChallenge.dto';
import { CreateChallengeCompleter, CreateChallengeInstructionDto, CreateChallengeSolutionDto } from './dto';
import { AdminGuard, JwtGuard } from '../guard';

@Controller('challenges')
export class ChallengesController {
  constructor(private challengeService: ChallengesService,
    private cloudinaryService: CloudinaryService,) { }

  @UseGuards(JwtGuard, AdminGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createChallenge(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateChallengeDto,
  ) {
    return this.challengeService.createChallenge(dto, file);
  }

  @UseGuards(JwtGuard)
  @Patch(':id/like')
  toggleLike(
    @Param('id') id: string,
    @Body('userId') userId: number,
  ) {
    return this.challengeService.toggleLike(id, userId);
  }

  @UseGuards(JwtGuard)
  @Get('')
  getChallenges() {
    return this.challengeService.getChallenges();
  }

  @UseGuards(JwtGuard)
  @Get('leaderboard')
  getLeaderboard() {
    return this.challengeService.getLeaderboard();
  }

  @UseGuards(JwtGuard)
  @Get('/:id')
  getChallengeById(@Param('id') id: string) {
    return this.challengeService.getChallengeById(id)
  }

  @UseGuards(JwtGuard)
  @Put('/:id')
  updateChallenge(@Param('id') id: string, @Body() dto: any) {
    return this.challengeService.updateChallenge(id, dto)
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post('/instruction')
  createChallengeInstruction(@Body() dto: CreateChallengeInstructionDto) {
    return this.challengeService.createChallengeInstruction(dto)
  }

  @UseGuards(JwtGuard)
  @Get('/instruction/:challengeId')
  getChallengeInstruction(@Param('challengeId') challengeId: number) {
    if (isNaN(challengeId)) {
      throw new BadRequestException("Invalid ChallengeId, must be number")
    }

    return this.challengeService.getChallengeInstructions(challengeId)
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Put('/instruction/:id')
  updateChallengeInstruction(@Param('id') id: string, @Body() dto: any) {
    return this.challengeService.updateChallengeInstruction(id, dto)
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete('/instruction/:id')
  deleteChallengeInstruction(@Param('id') id: string) {
    return this.challengeService.deleteChallengeInstruction(id)
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete(':id')
  async deleteChallenge(@Param('id') id: string) {
    return this.challengeService.deleteChallenge(id);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post('solution')
  createChallengeSolution(@Body() dto: CreateChallengeSolutionDto) {
    return this.challengeService.createChallengeSolution(dto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Delete('solution/:id')
  deleteChallengeSolution(@Param('id') id: number) {
    if (isNaN(Number(id))) {
      throw new BadRequestException("Id should be a number");
    }

    return this.challengeService.deleteChallengeSolution(Number(id));
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Patch('solution')
  updateChallengeSolution(@Body() dto: { id: number, solution: string }) {
    return this.challengeService.updateSolution(dto);
  }

  @UseGuards(JwtGuard)
  @Get('/solution/:challengeId')
  getChallengeSolution(@Param('challengeId') challengeId: number) {
    if (isNaN(challengeId)) {
      throw new BadRequestException("Invalid ChallengeId, must be number")
    }

    return this.challengeService.getChallengeSolution(challengeId)
  }

  @UseGuards(JwtGuard)
  @Post('/challenge-completer')
  createChallengeCompleter(@Body() dto: CreateChallengeCompleter) {
    return this.challengeService.createChallengeCompleter(dto);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post('/challenge-instruction/:instructionId')
  completeInstruction(@Param('instructionId') instructionId: number) {
    return this.challengeService.completeStep(instructionId);
  }

}