// src/auth/strategies/google.strategy.ts
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private configService: ConfigService) {
    const clientID = configService.get('GOOGLE_CLIENT_ID');
    const clientSecret = configService.get('GOOGLE_CLIENT_SECRET');
    
    if (!clientID || !clientSecret) {
      throw new Error('Google OAuth credentials not configured');
    }
    
    super({
      clientID,
      clientSecret,
      callbackURL: 'http://localhost:3000/autho/google/redirect',
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const user = {
      email: profile.emails?.[0]?.value,
      name: profile.displayName,
      photo: profile.photos?.[0]?.value,
      provider: 'google',
    };

    if (!user.email) {
      return done(new Error('No email found from Google OAuth'), false);
    }

    done(null, user);
  }
}
