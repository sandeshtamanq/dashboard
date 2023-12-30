import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

import { OtpType } from './otp/entities/otp.entity';
import { getOtpValidTime } from './otp/otp.service';

@Injectable()
export class SmtpService {
  constructor(private readonly mailerService: MailerService) {}

  private async sendMail(options: ISendMailOptions) {
    try {
      const res = await this.mailerService.sendMail(options);
      return res;
    } catch (err) {
      console.error(
        [
          '------------------------------------------------------------------------------------------',
          '------------------------------------ SMTP ERROR STARTS -----------------------------------',
          '------------------------------------------------------------------------------------------',
          err,
          '------------------------------------------------------------------------------------------',
          '------------------------------------- SMTP ERROR ENDS ------------------------------------',
          '------------------------------------------------------------------------------------------',
        ].join('\n'),
      );
    }
  }

  async sendEmail(emailBody: any) {
    return this.sendMail({
      to: emailBody.to,
      subject: emailBody.subject,
      template: 'sendEmail',
      context: {
        username: emailBody.name,
        body: emailBody.body,
      },
    });
  }

  async sendSignupMail(to: string, username: string) {
    // TODO:: Send email verification link with token
    return this.sendMail({
      to,
      subject: 'Welcome to Intopros',
      template: 'signup',
      context: {
        username,
      },
    });
  }

  async sendAdminSignupMail(email: string, username: string, password: string) {
    // TODO:: Send email verification link with token
    return this.sendMail({
      to: email,
      subject: 'Welcome to Intopros',
      template: 'adminSignup',
      context: {
        email,
        username,
        password,
      },
    });
  }

  async sendPasswordResetMail(email: string, username: string, token: string) {
    const expiresIn = dayjs
      .duration(getOtpValidTime(OtpType.PASSWORD_RESET))
      .humanize();
    const frontendURL = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

    return this.sendMail({
      to: email,
      subject: 'Reset your password',
      template: 'passwordReset',
      context: {
        username,
        frontendURL,
        expiresIn,
      },
    });
  }
}
