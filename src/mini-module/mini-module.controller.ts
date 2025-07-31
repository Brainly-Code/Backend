/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MiniModuleService } from './mini-module.service';
import { CreateMiniModuleDto } from './dto';
import { CreateMiniModuleProgressDto } from './dto/createMiniModuleProgress.dto';

@Controller('mini-modules')
export class MiniModuleController {
  constructor(private miniModuleService: MiniModuleService) {}

  @Post()
  createMiniModule(@Body() dto: CreateMiniModuleDto) {
    return this.miniModuleService.createMiniModule(dto);
  }

  @Get('/:id')
  getMiniModulePerModule(@Param('id')  id: string) {
    return this.miniModuleService.getMiniModulesPerCourseModule(id);
  }

  @Post('/progress')
  createMiniModuleProgress(@Body() dto: CreateMiniModuleProgressDto ) {
    return this.miniModuleService.createminiModuleProgress(dto);
  }

  @Get('/progress/:miniModuleId')
  async getMiniModuleProgress(@Param('miniModuleId') miniModuleId: number) {
      return await this.miniModuleService.getMiniModuleProgress(miniModuleId);
  }
}
