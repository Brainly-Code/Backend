/* eslint-disable prettier/prettier */
import { IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserCourseProgressDto {
  @IsInt()
  userId!: number;

  @IsInt()
  courseId!: number;

  @IsOptional()
  @IsInt()
  currentStep?: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

  @IsOptional()
  @IsInt()
  rating?: number;
}