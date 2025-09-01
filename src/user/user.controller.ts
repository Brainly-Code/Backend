/* eslint-disable prettier/prettier */
import { Controller, Body,Get, Param, Patch, UseGuards, UseInterceptors, Req, ParseIntPipe } from "@nestjs/common"; // Add Body, ParseIntPipe, ValidationPipe
import { User } from "generated/prisma";
import { GetUser } from "src/decorator";
import { UserService } from "./user.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Request } from "express";
import { JwtGuard } from "src/guard";


@Controller("users")
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get("profile")
  getMe(@GetUser() user: User) {
    return this.userService.getMe(user);
  }
  

  @Patch("edit/:id")
  @UseInterceptors(FileInterceptor("image"))
  async editUser(
    @Param("id", ParseIntPipe) id: number,
    @Body() body: any,  // ✅ use @Body to capture text fields
  ) {
    const { username, email, isPremium, password } = body;
    console.log("Received body:", body); // Debugging line
    const isPremiumBoolean =
      typeof isPremium === "string" ? isPremium === "true" : isPremium;

    return this.userService.editUser(id, {
      username,
      email,
      password, // ✅ now actually forwarded
      isPremium: isPremiumBoolean,
    });
  }

  @Get(":id")
  getCurrentUserById(@Param("id", ParseIntPipe) id: number) { // Use ParseIntPipe
    return this.userService.getCurrentUser(id.toString()); // Convert back to string if service expects string
  }

 
  @Patch("upgrade-to-pro/:id") 
  @UseGuards(JwtGuard) 
  async upgradeToPro(
    @Param("id", ParseIntPipe) userId: number,

  ) {
//payment verification
    return this.userService.upgradeUserToPro(userId);
  }
 
}