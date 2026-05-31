/* eslint-disable prettier/prettier */

import { IsNotEmpty, IsNumber, IsString, IsOptional } from "class-validator";

export class updateChallengeInstructionDto {
  @IsOptional()
  @IsNumber()
  number?: number;

  @IsOptional()
  @IsString()
  instruction?: string;
}
