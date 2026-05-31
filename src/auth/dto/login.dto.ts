/* eslint-disable prettier/prettier */
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

/* eslint-disable prettier/prettier */
export  class LoginDto {
  @ApiProperty({
    description: "Email of user",
    name: "izere@gmail.com",
    required: true,
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;
  
  @ApiProperty({
    description: "User's password",
    name: "izere12",
    required: true
  })
  @IsString()
  @IsNotEmpty()
  password!: string;
}