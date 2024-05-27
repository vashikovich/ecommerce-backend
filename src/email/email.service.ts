import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { EmailContent } from './dto/email-content';

sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

type EmailTemplateType = 'SIGN_UP' | 'SUBSCRIPTION' | 'ORDER';

@Injectable()
export class EmailService {
  async sendEmail(
    recipient: string,
    template: EmailTemplateType,
    values: any,
  ): Promise<boolean> {
    const content = this.generateEmailTemplate(template, values);
    const msg: sgMail.MailDataRequired = {
      to: recipient,
      from: 'indera.waskitho@gmail.com',
      subject: content.subject,
      html: content.bodyHtml,
      text: content.bodyText,
    };
    const result = await sgMail.send(msg);
    return result[0].statusCode === 200;
  }

  private generateEmailTemplate(
    type: EmailTemplateType,
    values: any,
  ): EmailContent {
    if (type == 'SIGN_UP') {
      const template = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Welcome to [Your E-commerce Website]</title><style>body{font-family:Arial,sans-serif;margin:0;padding:0;background-color:#f4f4f4}.container{max-width:600px;margin:0 auto;background-color:#fff;padding:20px;border-radius:8px;box-shadow:0 0 10px rgba(0,0,0,.1)}.header{text-align:center;padding:10px 0;background-color:#4caf50;color:#fff;border-radius:8px 8px 0 0}.header h1{margin:0}.content{padding:20px;text-align:center}.content p{font-size:16px;line-height:1.5;color:#333}.cta-button{display:inline-block;padding:10px 20px;margin-top:20px;color:#fff;background-color:#4caf50;text-decoration:none;border-radius:5px}.footer{text-align:center;padding:10px 0;background-color:#f1f1f1;color:#666;border-radius:0 0 8px 8px}.footer p{margin:0}</style></head><body><div class="container"><div class="header"><h1>Welcome to [Your E-commerce Website]</h1></div><div class="content"><p>Hi [User's Name],</p><p>Thank you for signing up at [Your E-commerce Website]! We're excited to have you on board. Here, you can find the best products at the best prices, just for you.</p><p>Get started by browsing our latest collections and exclusive offers.</p><a href="[Your Website URL]" class="cta-button">Start Shopping</a></div><div class="footer"><p>If you have any questions, feel free to<a href="[Contact URL]">contact us</a>.</p><p>&copy; 2024 [Your E-commerce Website]. All rights reserved.</p></div></div></body></html>`;
      return {
        subject: 'welcome',
        bodyHtml: template,
        bodyText: template,
      };
    }
    if (type == 'SUBSCRIPTION') {
      return new EmailContent();
    }
    if (type == 'ORDER') {
      return new EmailContent();
    }
  }
}
