/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {
  ExtractJwt,
  Strategy,
} from "passport-jwt";
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt'
) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    const jwtSecret =
      config.get<string>("JWT_SECRET");
    if (!jwtSecret) {
      throw new Error(
        "JWT_SECRET is not defined in environment variables",
      );
    }

    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: {
    sub: number,
    email: string
  }) {
    const user = await this.prisma.user.findUnique({
      where: {
        id: payload.sub,
      }
    })
    //return the payload
    return user;
  }
}
