/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsEnum, IsOptional, IsStrongPassword } from "class-validator";
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
  @IsStrongPassword(
      { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 },
  { message: "Password must be at least 8 chars, include upper/lowercase, number, and symbol" }
  )
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
