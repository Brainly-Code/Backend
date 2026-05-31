/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCourseModuleDto {
  @IsNumber()
  @IsNotEmpty()
  courseId!: number;

  @IsString()
  @IsNotEmpty()
  title!: string;
}