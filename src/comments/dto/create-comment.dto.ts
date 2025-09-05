import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  message!: string;

  @IsOptional()
  @IsInt()
  userId?: number;
}
