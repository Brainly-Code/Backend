/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable prettier/prettier */
import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './autho.service';
import { ConfigService } from '@nestjs/config';

@Controller('autho')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  // Start Google OAuth login flow
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Redirects automatically to Google's OAuth consent screen
  }

  // Handle Google OAuth redirect
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req.user) throw new Error('No user data received from Google OAuth');

      const oauthUser = {
        email: (req.user as any).email,
        name: (req.user as any).name,
        photo: (req.user as any).photo,
        provider: 'google' as const,
      };

      const { access_token } = await this.authService.validateOAuthLogin(oauthUser);

      const frontendUrl = this.configService.get('FRONTEND_URL') || 'https://frontend-mdy5.onrender.com';
      console.log("frontendUrl", access_token);
      return res.redirect(`${frontendUrl}/user?token=${access_token}`);
      
    } catch (err: any) {
      console.error('Error in googleAuthRedirect:', err);
      const frontendUrl = this.configService.get('FRONTEND_URL') || 'https://frontend-mdy5.onrender.com';
      return res.redirect(`${frontendUrl}/auth/error?message=${encodeURIComponent(err.message)}`);
    }
  }

  // Start GitHub OAuth login flow
  @Get('github')
  @UseGuards(AuthGuard('github'))
  async githubAuth() {
    // Redirects automatically to GitHub's OAuth consent screen
  }

  // Handle GitHub OAuth redirect
  @Get('github/redirect')
  @UseGuards(AuthGuard('github'))
  async githubAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      if (!req.user) throw new Error('No user data received from GitHub OAuth');

      const user = req.user as any;
      
      // Handle GitHub's email privacy settings
      let email = user.email;
      
      // If primary email is not available, try to get it from emails array
      if (!email && user.emails && user.emails.length > 0) {
        // Look for primary email first
        const primaryEmail = user.emails.find((e: any) => e.primary);
        email = primaryEmail ? primaryEmail.value : user.emails[0].value;
      }
      
      // If still no email, use GitHub username as fallback
      if (!email) {
        email = `${user.username}@github.local`; // or handle this case differently
        console.warn(`GitHub user ${user.username} has no public email, using fallback`);
      }

      const oauthUser = {
        email: email,
        name: user.name || user.displayName || user.username,
        photo: user.photo || user.avatar_url || user._json?.avatar_url,
        provider: 'github' as const,
        githubId: user.id, // Add GitHub ID for reference
        username: user.username, // Add username for reference
      };

      const { access_token } = await this.authService.validateOAuthLogin(oauthUser);

      const frontendUrl = this.configService.get('FRONTEND_URL') || 'https://frontend-mdy5.onrender.com';
      return res.redirect(`${frontendUrl}/user?token=${access_token}`);
    } catch (err: any) {
      console.error('Error in githubAuthRedirect:', err);
      const frontendUrl = this.configService.get('FRONTEND_URL') || 'https://frontend-mdy5.onrender.com';
      return res.redirect(`${frontendUrl}/auth/error?message=${encodeURIComponent(err.message)}`);
    }
  }
}