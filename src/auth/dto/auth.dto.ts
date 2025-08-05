/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional } from "class-validator";
import { Role } from "@prisma/client";

export class AuthDto {
  @ApiProperty({
    description: "User email",
    name: "izere@gmail.com",
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    description: "User password",
    name: "izere12",
    required: true
  })
  @IsString()
  @IsNotEmpty()
  password!: string;

  @ApiProperty({
    description: "User's name",
    name: "Izere",
    required: true
  })
  @IsString()
  @IsOptional()
  username!: string;
  
  @ApiProperty({
    description: "User role",
    name: "TEACHER",
    required: true,
    enum: Role
  })
  @IsOptional()
  @IsEnum(Role)
  role!: Role;
}
