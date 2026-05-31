/* eslint-disable prettier/prettier */
import { IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateLessonProgressDto {
  @IsInt()
  userId!: number;

  @IsInt()
  lessonId!: number;

  @IsOptional()
  @IsInt()
  currentStep?: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}