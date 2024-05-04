import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { mailTrapPwd, mailTrapUsername } from 'src/utils/constants';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Initialise le transporteur de nodemailer avec les informations de connexion SMTP
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false, // true pour le port 465, false pour les autres ports
      auth: {
        user: mailTrapUsername,
        pass: mailTrapPwd,
      },
    });
  }
  connectionTimeout: 60000

  async sendActivationEmail(email: string, activationToken: string) {
    // Configure le contenu de l'e-mail
    const mailOptions: nodemailer.SendMailOptions = {
      from: 'fogouangloic10@gmail.com',
      to: email,
      subject: 'Activation Instructions',
      html: `
        <p>Hello,</p>
        <p>Thank you for registering. Please click the following link to activate your account:</p>
        <p><a href="http://localhost:3000/auth/activate/${activationToken}">Activate Account</a></p>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `,
    };

    // Envoie l'e-mail
    await this.transporter.sendMail(mailOptions);
  }
}
