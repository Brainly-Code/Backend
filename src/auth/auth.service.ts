/* eslint-disable prettier/prettier */
import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { LoginDto } from "./dto/login.dto";
import { MailService } from '../mail/mail.service';
import * as crypto from 'crypto';
import { BadRequestException } from "@nestjs/common";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
    private mailService: MailService,
  ) { }

  async signup(dto: AuthDto): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const hash = await argon.hash(dto.password);
      const user = await this.prisma.user.create({
        data: {
          username: dto.username,
          email: dto.email,
          hash,
          role: dto.role || 'USER',
          isPremium: false,
        },
      });

      const createdUser = await this.prisma.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          role: true,
          isPremium: true,
        },
      });

      if (!createdUser) {
        throw new ForbiddenException("Could not retrieve user details after signup.");
      }

      return this.generateTokens(
        createdUser.id,
        createdUser.email,
        createdUser.role ?? 'USER',
        createdUser.isPremium,
      );
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ForbiddenException("User already exists");
      }
      throw error;
    }
  }

  async login(dto: LoginDto): Promise<{ access_token: string; refresh_token: string; user: { id: number; email: string; role: string | null; isPremium: boolean } }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: {
        id: true,
        email: true,
        hash: true,
        role: true,
        isPremium: true,
      },
    });

    if (!user) throw new ForbiddenException("User not found");
    if (!user.hash) {
      throw new ForbiddenException("This account was created with OAuth. Please use OAuth to sign in.");
    }

    const pwMatches = await argon.verify(user.hash, dto.password);
    if (!pwMatches) throw new ForbiddenException("Incorrect password");

    const { access_token, refresh_token } = await this.generateTokens(user.id, user.email, user.role ?? 'USER', user.isPremium);
    return { access_token: access_token, refresh_token: refresh_token, user: { id: user.id, email: user.email, role: user.role ?? "USER", isPremium: user.isPremium } }
  }

  async refresh(refreshToken: string | undefined): Promise<{ access_token: string; refresh_token: string; user: { id: number; email: string; role: string | null; isPremium: boolean } }> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    try {
      const secret = this.config.get<string>('JWT_REFRESH_SECRET');
      const payload = await this.jwt.verifyAsync(refreshToken, { secret }) as any;

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          role: true,
          isPremium: true,
        },
      });

      if (!user) throw new UnauthorizedException('Invalid refresh token - user not found');

      const { access_token, refresh_token } = await this.generateTokens(user.id, user.email, user.role ?? 'USER', user.isPremium);
      return { access_token: access_token, refresh_token: refresh_token, user: { id: user.id, email: user.email, role: user.role ?? "USER", isPremium: user.isPremium } }
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private async generateTokens(userId: number, email: string, role: string, isPremium: boolean) {
    const accessPayload = { sub: userId, email, role, isPremium };
    const refreshPayload = { sub: userId };

    const accessToken = await this.jwt.signAsync(accessPayload, {
      expiresIn: '15m',
      secret: this.config.get<string>('JWT_SECRET'),
    });

    const refreshToken = await this.jwt.signAsync(refreshPayload, {
      expiresIn: '7d',
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async getMe(token: object) {
    return await this.prisma.user.findUnique({
      where: {
        id: token['sub'],
      },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isPremium: true,
        createdAt: true,
        updatedAt: true
      },
    });
  }

  logout() {
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new NotFoundException('User with this email does not exist.');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    await this.mailService.sendResetPasswordEmail(user.email, resetToken);

    return { message: 'Password reset link has been sent to your email.' };
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Invalid or expired reset token');
    }

    const hash = await argon.hash(newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        hash,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Password reset successfully' };
  }
}
