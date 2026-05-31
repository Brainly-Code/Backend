/* eslint-disable prettier/prettier */
import { IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateModuleProgressDto {
  @IsInt()
  userId!: number;

  @IsInt()
  courseModuleId!: number;

  @IsOptional()
  @IsInt()
  currentStep?: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;

}