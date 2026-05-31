/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateLessonDto {
  @IsNumber()
  @IsNotEmpty()
  miniModuleId!: number;

  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  explanation!: string;

  @IsString()
  @IsOptional()
  more!: string;

  @IsString()
  @IsOptional()
  example!: string;

  @IsString()
  @IsOptional()
  note!: string;

  @IsString()
  @IsNotEmpty()
  assignment!: string;

}