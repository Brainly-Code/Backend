import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto, CreateLessonProgressDto, CreateLessonSolutionDto, TrackLessonProgressDto } from './dto';
import { AdminGuard, JwtGuard } from '../guard';

@Controller('lesson')
export class LessonController {
  constructor(private lessonService: LessonService) { }

  @UseGuards(JwtGuard, AdminGuard)
  @Post()
  createLesson(@Body() dto: CreateLessonDto) {
    return this.lessonService.createLesson(dto);
  }

  @UseGuards(JwtGuard)
  @Get()
  getLessons() {
    return this.lessonService.getLessons();
  }

  @UseGuards(JwtGuard)
  @Get('more/:miniModuleId')
  getLessonPerMiniModule(@Param('miniModuleId') miniModuleId: string) {
    return this.lessonService.getLessonsPerMiniModule(miniModuleId)
  }

  @UseGuards(JwtGuard)
  @Get('/:id')
  getLessonById(@Param('id') id: string) {
    return this.lessonService.getLessonById(id);
  }

  @UseGuards(JwtGuard)
  @Post('/progress')
  createLessonProgress(@Body() dto: CreateLessonProgressDto) {
    return this.lessonService.createLessonProgress(dto);
  }

  @UseGuards(JwtGuard)
  @Patch('/progress/:id')
  incrementUserCourseProgress(@Param('id') id: number, @Body() dto: TrackLessonProgressDto) {
    if (isNaN(id)) {
      throw new Error("Invalid Id, should be number");
    }
    return this.lessonService.trackLessonProgress(id, dto);
  }

  @UseGuards(JwtGuard)
  @Get('/progress/:lessonId')
  GetLessonProgress(@Param('lessonId') lessonId: number) {
    if (isNaN(lessonId)) {
      throw new Error("Invalid lessonId, should be number");
    }

    return this.lessonService.getLessonProgress(lessonId);
  }

  @UseGuards(JwtGuard, AdminGuard)
  @Post('/solution')
  async createLessonSolution(@Body() dto: CreateLessonSolutionDto) {
    return this.lessonService.createLessonSolution(dto);
  }

  @UseGuards(JwtGuard)
  @Get('/solution/:lessonId')
  async getLessonSolution(@Param('lessonId') lessonId: number) {
    return await this.lessonService.getLessonSolution(lessonId);
  }
}
