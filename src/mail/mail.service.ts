import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.config.get<string>('MAIL_HOST'),
      port: this.config.get<number>('MAIL_PORT'),
      secure: this.config.get<number>('MAIL_PORT') === 465, // true for 465, false for other ports
      auth: {
        user: this.config.get<string>('MAIL_USER'),
        pass: this.config.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendResetPasswordEmail(to: string, token: string) {
    const frontendUrl =
      this.config.get('FRONTEND_URL') || 'http://localhost:5173';

    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    const mailOptions = {
      from: this.config.get<string>('MAIL_FROM') || 'BrainlyCode <izerejoshua94@gmail.com>',
      to,
      subject: 'Reset your password',
      html: `
        <h2>Password Reset</h2>
        <p>You requested to reset your password.</p>
        <p>Click the button below to reset it:</p>

        <a href="${resetLink}"
        style="
          display:inline-block;
          padding:12px 20px;
          background:#2563eb;
          color:white;
          text-decoration:none;
          border-radius:6px;
          font-weight:bold;
        ">
          Reset Password
        </a>

        <p>This link expires in 1 hour.</p>
      `,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Reset password email sent with Nodemailer');
    } catch (error) {
      console.error('Error sending reset password email:', error);
      throw error;
    }
  }
}
