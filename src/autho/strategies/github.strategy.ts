import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(private configService: ConfigService) {
    const clientID = configService.get('GITHUB_CLIENT_ID');
    const clientSecret = configService.get('GITHUB_CLIENT_SECRET');
    const callbackURL = configService.get('GITHUB_CALLBACK_URL');
    
    if (!clientID || !clientSecret || !callbackURL) {
      throw new Error('GitHub OAuth credentials not configured');
    }
    
    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['user:email'], // This is crucial - request email scope
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: any,
  ) {
    try {
      // GitHub might not provide email in profile if user's email is private
      // We need to fetch emails separately using the access token
      let email = profile.emails?.[0]?.value;
      
      if (!email) {
        // Fetch user's email using GitHub API
        try {
          const response = await axios.get('https://api.github.com/user/emails', {
            headers: {
              'Authorization': `token ${accessToken}`,
              'User-Agent': 'YourApp/1.0.0', // GitHub requires a User-Agent header
            },
          });
          
          const emails = response.data;
          const primaryEmail = emails.find((e: any) => e.primary && e.verified);
          email = primaryEmail ? primaryEmail.email : emails[0]?.email;
        } catch (error) {
          console.error('Failed to fetch GitHub emails:', error);
        }
      }

      const user = {
        id: profile.id,
        username: profile.username,
        name: profile.displayName || profile.name,
        email: email,
        photo: profile.photos?.[0]?.value,
        avatar_url: profile._json?.avatar_url,
        provider: 'github',
        accessToken, // Include access token if needed later
      };

      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
}