import { IsNumber, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateLessonVideoDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  miniModuleId!: number;
}
