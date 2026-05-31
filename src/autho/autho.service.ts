/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) { }

  async validateOAuthLogin(oauthUser: {
    email: string;
    name: string;
    photo?: string;
    provider: 'google' | 'github';
    githubId?: string;
    username?: string;
  }) {
    // 1. Find or create the user in your DB
    let user = await this.userService.findByEmail(oauthUser.email);
    if (!user) {
      user = await this.userService.createOAuthUser(oauthUser);
    }

    // 2. Generate tokens
    const access_token = await this.signToken(
      user.id,
      user.email,
      user.role ?? 'USER',
      user.isPremium,
    );
    const refresh_token = await this.signRefreshToken(
      user.id,
    );

    // 3. Optionally, save the refresh token hash in DB for security

    return { access_token, refresh_token, user };
  }

  async signToken(id: number, email: string, role: string, isPremium: boolean) {
    return this.jwtService.signAsync(
      { sub: id, email, role, isPremium },
      {
        expiresIn: '15m',
        secret: this.config.get('JWT_SECRET'),
      }
    );
  }

  async signRefreshToken(id: number) {
    return this.jwtService.signAsync(
      { sub: id },
      {
        expiresIn: '7d',
        secret: this.config.get('JWT_REFRESH_SECRET'),
      }
    );
  }
}
