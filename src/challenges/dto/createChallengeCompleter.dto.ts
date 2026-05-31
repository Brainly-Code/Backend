/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
export class CreateChallengeCompleter {

  @IsNotEmpty()
  @IsNumber()
  userId!: number;

  @IsNumber()
  @IsNotEmpty()
  challengeId!: number;

  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  solution?: string;
}