/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber } from "class-validator";
export class CreateChallengeCompleter {

  @IsNotEmpty()
  @IsNumber()
  userId!: number;

  @IsNumber()
  @IsNotEmpty()
  challengeId!: number;

}