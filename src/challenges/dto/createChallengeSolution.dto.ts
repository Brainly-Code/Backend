/* eslint-disable prettier/prettier */
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateChallengeSolutionDto {
  @IsNotEmpty()
  @IsInt()
  challengeId!: number;

  @IsNotEmpty()
  @IsString()
  solution!: string;
  
  @IsNotEmpty()
  @IsInt()
  number!: number;

}