import sgMail from '@sendgrid/mail'
import { SENDGRID_API_KEY } from "../config/environment.js"
import { IEmail } from '../types/email.types.js';
import emailTemplates from '../templates/email.templates.js';

sgMail.setApiKey(SENDGRID_API_KEY)

export default async function sendEmail(email: IEmail) {
  try {
    const msg = {
      to: email.to,
      from: 'sync.ideas.group@gmail.com',
      subject: email.subject,
      text: email.text,
      html: email.html,
    };
    await sgMail.send(msg);
    return { result: true };
  } catch (error: any) {
    console.error(error);
    return { result: false, error };
  }
}

export class EmailHandler {

  private constructor() { }

  private static async sendEmail(msg: any) {
    try {
      const response = await sgMail.send(msg)
      if (response[0].statusCode !== 202) return { success: false, message: 'Email not sent' }
      return { success: true, message: 'Email sent.' }
    } catch (error) {
      return error
    }
  }

  static async sendVerificationEmail(email: string, fullname: string, verificationCode: string): Promise<any> {
    try {
      const msg = emailTemplates.confirmEmail(email, fullname, verificationCode)
      return await this.sendEmail(msg)
    } catch (error) {
      return {
        success: false,
        message: 'Error sending verification email.',
        error
      }
    }
  }



}




