import { IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateMessageDto {
  @IsNumber()
  senderId!: number;

  @IsNumber()
  receiverId!: number;

  @IsString()
  content!: string;

  @IsOptional()
  @IsString()
  type?: string;
}