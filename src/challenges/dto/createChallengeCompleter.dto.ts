/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber } from "class-validator";
export class CreateChallengeCompleter {

  @IsNotEmpty()
  userId!: number;

  @IsNotEmpty()
  challengeId!: number;

}