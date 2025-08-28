/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  HttpCode,
  Post,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthDto } from "./dto";
import { LoginDto } from "./dto/login.dto";
// import { Throttle } from "@nestjs/throttler";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  //Signup Controller
  @Post("signup")
  signup(
    @Body()
    dto: AuthDto,
  ) {
    return this.authService.signup(dto);
  }

  //Login Controller
  //Using throttle to limit the number of logins
  // @Throttle(5, 60)
  //loging in
  @Post("login")
  login(
    @Body()
    dto: LoginDto,
  ) {
    return this.authService.login(dto);
  }

  @Post("logout")
  @HttpCode(200)
  logout() {
    return this.authService.logout();
  }


}
