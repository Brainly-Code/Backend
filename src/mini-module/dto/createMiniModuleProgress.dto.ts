/* eslint-disable prettier/prettier */
import { IsInt, IsOptional, IsBoolean } from 'class-validator';

export class CreateMiniModuleProgressDto {
  @IsInt()
  userId!: number;

  @IsInt()
  miniModuleId!: number;

  @IsOptional()
  @IsInt()
  currentStep?: number;

  @IsOptional()
  @IsBoolean()
  completed?: boolean;
}