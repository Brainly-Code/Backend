/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtGuard } from 'src/guard';
import { EditUserDto } from './dto';

@Controller('admin')
export class AdminController {
  constructor(private adminServices:  AdminService) {}
  @Get('stats')
  getDashboardStats() {
    return this.adminServices.getDashboardStats();
  }

  @Get('')
  getUsers() {
    return this.adminServices.getUsers();
  }
  
  @UseGuards(JwtGuard)
  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminServices.deleteUser(id);
  }

  @UseGuards(JwtGuard)
  @Put('/edit/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() dto: EditUserDto,
  ) {
    return this.adminServices.editUser(+id, { ...dto });
  }

  @Post('/lesson/solution')
  createLessonSolution(@Body() dto: {lessonId: number, solution: string}) {
    return this.adminServices.createLessonSolution(dto);
  }
}
