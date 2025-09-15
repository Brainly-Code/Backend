/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  HttpCode,
  Post,
  Req,
  Res,
} from "@nestjs/common";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  // --- SIGNUP ---
  @Post("signup")
  async signup(@Res() res: Response, @Body() dto: AuthDto) {
    const { access_token, refresh_token } = await this.authService.signup(dto);

    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ access_token });
  }

  @Post("login")
  async login(@Body() dto: LoginDto, @Res() res: Response) {
    const { access_token, refresh_token } = await this.authService.login(dto);

     res.cookie('refresh_token', refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

    return res.json({ access_token});
  }

  @Post("refresh")
  async refresh(@Req() req: Request, @Res() res: Response) {
    const refresh_token = req.cookies["refresh_token"];
    const { access_token } = await this.authService.refresh(refresh_token);
    return res.json({ access_token });
  }

  @Post("logout")
  async logout(@Res() res: Response) {
    res.clearCookie("refresh_token");
    return res.json({ message: "Logged out successfully" });
  }
}
