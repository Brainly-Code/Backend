/* eslint-disable prettier/prettier */
import { IsInt, IsNotEmpty } from "class-validator";
export class CreateChallengeCompleter {

  @IsNotEmpty()
  @IsInt()
  userId!: number;

  @IsInt()
  @IsNotEmpty()
  challengeId!: number;

}