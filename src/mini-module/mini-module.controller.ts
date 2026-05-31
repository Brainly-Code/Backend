import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { MiniModuleService } from './mini-module.service';
import { CreateMiniModuleDto } from './dto';
import { CreateMiniModuleProgressDto } from './dto/createMiniModuleProgress.dto';
import { AdminGuard, JwtGuard } from '../guard';

@Controller('mini-modules')
export class MiniModuleController {
  constructor(private miniModuleService: MiniModuleService) { }

  @UseGuards(JwtGuard, AdminGuard)
  @Post()
  createMiniModule(@Body() dto: CreateMiniModuleDto) {
    return this.miniModuleService.createMiniModule(dto);
  }

  @UseGuards(JwtGuard)
  @Get('/:id')
  getMiniModulePerModule(@Param('id') id: string) {
    return this.miniModuleService.getMiniModulesPerCourseModule(id);
  }

  @UseGuards(JwtGuard)
  @Post('/progress')
  createMiniModuleProgress(@Body() dto: CreateMiniModuleProgressDto) {
    return this.miniModuleService.createminiModuleProgress(dto);
  }

  @UseGuards(JwtGuard)
  @Get('/progress/:miniModuleId')
  async getMiniModuleProgress(@Param('miniModuleId') miniModuleId: number) {
    return await this.miniModuleService.getMiniModuleProgress(miniModuleId);
  }
}
