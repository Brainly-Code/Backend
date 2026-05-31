/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateMiniModuleDto {

  @IsNotEmpty()
  @IsNumber()
  courseModuleId!: number;

  @IsNotEmpty()
  @IsString()
  title!: string;

}