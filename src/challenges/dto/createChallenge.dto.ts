/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsOptional } from "class-validator";

export class CreateChallengeDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  difficulty!: string;
  
  @IsNotEmpty()
  @IsString()
  description!: string;

  @IsNotEmpty()
  @IsString()
  relation!: string;

  @IsNotEmpty()
  @IsString()
  duration!: string;

  @IsOptional()
  @IsString()
  documentUrl?: string;
}