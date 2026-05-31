import { BadRequestException, Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminGuard, JwtGuard } from '../guard';
import { EditUserDto } from './dto';

@Controller('admin')
export class AdminController {
  constructor(private adminServices:  AdminService) {}

  //Fetching dashboard data
  @UseGuards(JwtGuard, AdminGuard)
  @Get('stats')
  getDashboardStats() {
    return this.adminServices.getDashboardStats();
  }

  //Fetching users' data
  @UseGuards(JwtGuard, AdminGuard)
  @Get('')
  getUsers() {
    return this.adminServices.getUsers();
  }
  
  //Deleting user
  @UseGuards(JwtGuard, AdminGuard)
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminServices.deleteUser(id);
  }

  //Updating user
  @UseGuards(JwtGuard, AdminGuard)
  @Put('/edit/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: EditUserDto,
  ) {
    return this.adminServices.editUser(+id, { ...dto });
  }

  //Creating lesson solution
  @UseGuards(JwtGuard, AdminGuard)
  @Post('/lesson/solution')
  createLessonSolution(@Body() dto: {lessonId: number, solution: string}) {
    return this.adminServices.createLessonSolution(dto);
  }

  //Get Lesson Completions
  @UseGuards(JwtGuard, AdminGuard)
  @Get('/challenge-completers/:challengeId')
  GetLessonCompleters(@Param('challengeId') challengeId: number) {
    return this.adminServices.getLessonCompleters(challengeId);
  }

  //Correct Completion
  @UseGuards(JwtGuard, AdminGuard)
  @Patch('/challenge-completers')
  correctCompleters(
    @Body() dto: {userId, id}
) {
    const completerId = Number(dto.id);
    console.log(completerId, dto.userId);
    if(isNaN(dto.id) || isNaN(dto.userId)){
      throw new BadRequestException("UserId and answer id must be numbers")
    }

    return this.adminServices.correctCompleters(completerId, dto);
  }

  //Get Graph Stats
  @UseGuards(JwtGuard, AdminGuard)
  @Get('/graph-stats')
  getGraphStats() {
    return this.adminServices.getGraphStats();
  }

  //Reject Response
  @UseGuards(JwtGuard, AdminGuard) 
  @Patch('/reject')
  rejectAnswer(
    @Body() dto: {userId: number, id: number}
  ) {
    const answerId = Number(dto.id);
    console.log("answer id is:", answerId);
    console.log("user id  is:", dto.userId);
    return this.adminServices.rejectAnswer(answerId, dto);
  }

}
