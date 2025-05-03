import { Injectable } from '@nestjs/common';
import {
  IEmailService,
  ImailData,
} from 'src/auth/core/interfaces/recover-password/email-service.interface';
import * as nodemailer from 'nodemailer';

@Injectable()
export class NodeMailerService implements IEmailService {
  private readonly transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async send(data: ImailData): Promise<void> {
    const mailOptions = {
      from: 'Recipes',
      to: data.to,
      subject: data.subject,
      html: data.body,
    };
    return await this.transporter.sendMail(mailOptions);
  }
}
