/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsOptional, IsString, IsIn } from "class-validator"

export class CreateCourseDto {
  
  @IsString()
  title!: string;
  
  @IsString()
  category!: string;
  
  @IsIn(["BEGINNER", "INTERMEDIATE", "ADVANCED"]) 
  level!: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

  @IsString()
  @IsNotEmpty()
  description!: string;
  
  
  @IsOptional()
  studentsCount!: number;
}