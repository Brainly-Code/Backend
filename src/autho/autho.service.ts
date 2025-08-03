import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateOAuthLogin(oauthUser: {
    email: string;
    name: string;
    photo?: string;
    provider: 'google' | 'github';
  }) {
    // Check if user exists by email
    let user = await this.userService.findByEmail(oauthUser.email);

    // Create new OAuth user if none exists
    if (!user) {
      user = await this.userService.createOAuthUser(oauthUser);
    }

    // Create JWT payload
    const payload = { sub: user.id, email: user.email, username: user.username, role: user.role };
    const access_token = this.jwtService.sign(payload);

    return { access_token, user };
  }
}
