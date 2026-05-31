import { IsString, IsOptional } from 'class-validator';

export class CreateCourseResourceDto {
  @IsString()
  title!: string;

  @IsString()
  type!: string;

  @IsString()
  courseId!: string;
}
