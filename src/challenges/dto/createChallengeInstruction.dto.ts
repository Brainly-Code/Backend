/* eslint-disable prettier/prettier */
import { IsInt, IsNotEmpty, IsString } from "class-validator";

export class CreateChallengeInstructionDto {
  @IsNotEmpty()
  @IsInt()
  challengeId!: number;

  @IsNotEmpty()
  @IsString()
  instruction!: string;
  
  @IsNotEmpty()
  @IsInt()
  number!: number;

}