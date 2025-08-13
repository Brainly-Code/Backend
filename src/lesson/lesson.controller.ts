/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto, CreateLessonProgressDto, CreateLessonSolutionDto, TrackLessonProgressDto } from './dto';

@Controller('lesson')
export class LessonController {
  constructor(private lessonService: LessonService) {}

  @Post()
  createLesson(@Body() dto: CreateLessonDto) {
    return this.lessonService.createLesson(dto);
  }

  @Get()
  getLessons() {
    return this.lessonService.getLessons();
  }

  @Get('more/:miniModuleId')
  getLessonPerMiniModule(@Param('miniModuleId') miniModuleId: string) {
    return this.lessonService.getLessonsPerMiniModule(miniModuleId)
  } 

  @Get('/:id')
  getLessonById(@Param('id') id: string) {
    return this.lessonService.getLessonById(id);
  }

  @Post('/progress')
  createLessonProgress(@Body() dto: CreateLessonProgressDto) {
    return this.lessonService.createLessonProgress(dto);
  }

  @Patch('/progress/:id')
  incrementUserCourseProgress(@Param('id') id: number, @Body() dto: TrackLessonProgressDto ) {
    if(isNaN(id)) {
      throw new Error("Invalid Id, should be number");
    }
    return this.lessonService.trackLessonProgress(id, dto);
  }

  @Get('/progress/:lessonId')
  GetLessonProgress(@Param('lessonId') lessonId: number) {
    if(isNaN(lessonId)) {
      throw new Error("Invalid lessonId, should be number");
    }

    return this.lessonService.getLessonProgress(lessonId);
  }

  @Post('/solution')
  async createLessonSolution(@Body() dto: CreateLessonSolutionDto ) {
    return this.lessonService.createLessonSolution(dto);
  }

  @Get('/solution/:lessonId')
  async getLessonSolution(@Param('lessonId') lessonId: number) {
      return await this.lessonService.getLessonSolution(lessonId);
  }
}
