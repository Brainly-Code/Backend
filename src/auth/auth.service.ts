/* eslint-disable prettier/prettier */
import {
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { ApiBadRequestResponse, ApiResponse } from "@nestjs/swagger";
import { LogoutDto } from "./dto/logout.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  @ApiResponse({
    description: 'User created successfully as required'
  })
  @ApiBadRequestResponse({
    description: 'User could not register. Try again'
  })
  async signup(dto: AuthDto) {
    try {
      //Create hashed password with argon
      const hash = await argon.hash(dto.password);
      //Save the new user in db
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          hash,
          role: dto.role,
          isPremium: false, // <-- Explicitly set isPremium to false on signup
        },
      });

      // Returning the user token, now including isPremium
      // We need to fetch the user again to ensure we get all fields including isPremium
      const createdUserWithPremium = await this.prisma.user.findUnique({
          where: { id: user.id },
          select: {
              id: true,
              email: true,
              role: true,
              isPremium: true, // Select isPremium
              // Add other fields you want to return with the token payload if necessary
          }
      });

      if (!createdUserWithPremium) {
        throw new ForbiddenException("Could not retrieve user details after signup.");
      }

      return this.signToken(createdUserWithPremium.id, createdUserWithPremium.email, createdUserWithPremium.role, createdUserWithPremium.isPremium);
    } catch (error) {
      if (
        error instanceof
        PrismaClientKnownRequestError
      ) {
        if (error.code === "P2002") {
          throw new ForbiddenException(
            "User already exists",
          );
        }
      }
      throw error;
    }
  }

  async login(dto: LoginDto) {
    //Find the user by email
    const user =
      await this.prisma.user.findUnique({
        where: {
          email: dto.email,
        },
        select: { // Select all necessary fields, including isPremium
            id: true,
            email: true,
            hash: true,
            role: true,
            isPremium: true, // <-- Select isPremium here
        }
      });

    if (!user) {
      throw new ForbiddenException(
        "User not found",
      );
    }

    // Check if user has a password hash (OAuth users might not have one)
    if (!user.hash) {
      throw new ForbiddenException(
        "This account was created with OAuth. Please use OAuth to sign in.",
      );
    }

    //Compare passwords
    const pwMatches = await argon.verify(
      user.hash,
      dto.password,
    );
    //Throw error if not matching
    if (!pwMatches) {
      throw new ForbiddenException(
        "Incorrect password",
      );
    }

    // Return the token, now including isPremium
    return this.signToken(user.id, user.email, user.role, user.isPremium);
  }

  async signToken(
    userId: number,
    email: string,
    role: string,
    isPremium: boolean, // <-- Add isPremium as a parameter
  ): Promise<{
    access_token: string;
    user: { // Add a user object to the response for frontend
      id: number;
      email: string;
      role: string;
      isPremium: boolean;
    }
  }> {
    const payload = {
      sub: userId,
      email,
      role: role,
      isPremium: isPremium, // <-- Include isPremium in the JWT payload
    };

    const secret = this.config.get("JWT_SECRET");

    const token = await this.jwt.signAsync(
      payload,
      {
        expiresIn: "1day",
        secret: secret,
      },
    );

    return {
      access_token: token,
      user: { // Also return user details directly in the login/signup response
        id: userId,
        email: email,
        role: role,
        isPremium: isPremium,
      }
    };
  }

  logout(res: LogoutDto) {
    console.log(res)
    return {message: "Logged out successfully"};
  };
}