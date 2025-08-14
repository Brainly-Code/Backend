/* eslint-disable prettier/prettier */
import { IsInt, IsNotEmpty, IsString } from "class-validator";
export class CreateLessonSolutionDto {

  @IsInt()
  @IsNotEmpty()
  lessonId!: number;


  @IsString()
  @IsNotEmpty()
  solution!: string;

}