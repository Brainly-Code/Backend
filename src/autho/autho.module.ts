/* eslint-disable prettier/prettier */
// src/autho/autho.module.ts
import { Module } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from "./autho.controller"; // fix filename if needed
import { AuthService } from "./autho.service";
import { UserService } from "src/user/user.service";
import { PrismaService } from "src/prisma/prisma.service";
import { GoogleStrategy } from "./strategies/google.strategy";
import { GithubStrategy } from "./strategies/github.strategy";

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get("JWT_SECRET"),
        signOptions: { expiresIn: "60m" },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    PrismaService,
    GoogleStrategy,
    GithubStrategy,
  ],
})
export class AuthoModule {}
