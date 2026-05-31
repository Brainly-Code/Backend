import { IsNotEmpty, IsString, IsOptional, IsBoolean, IsInt } from "class-validator";
import { Transform } from "class-transformer";

export class CreateChallengeDto {
  @IsNotEmpty()
  @IsString()
  title!: string;

  @IsNotEmpty()
  @IsString()
  difficulty!: string;

  @IsInt()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  marks!: number;

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

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  useEditor?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  useInput?: boolean
}