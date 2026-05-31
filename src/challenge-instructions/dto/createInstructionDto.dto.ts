/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class createChallengeInstructionDto {
  @IsNumber()
  @IsNotEmpty()
  challengeId!: number;
  
  @IsNotEmpty()
  @IsNumber()
  number!: number;

  @IsString()
  @IsNotEmpty()
  instruction!: string;
}