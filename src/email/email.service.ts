import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';
import { EmailContent } from './dto/email-content';
import dayjs = require('dayjs');

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
      const { email } = values;
      const template = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Welcome to [Your Store Name]!</title><style>body{font-family:Arial,sans-serif;background-color:#f5f5f5;margin:0;padding:0}.container{width:100%;max-width:600px;margin:0 auto;background-color:#fff;padding:20px;box-shadow:0 0 10px rgba(0,0,0,.1)}.header{text-align:center;padding-bottom:20px}.logo{width:100px;margin-bottom:10px}.content{color:#333;line-height:1.6}.notice{margin-top:20px;padding:15px;background-color:#ff6f61;color:#fff;text-align:center;font-weight:700;border-radius:5px}.btn{display:inline-block;padding:10px 20px;margin-top:20px;background-color:#1f3a93;color:#fff;text-decoration:none;border-radius:5px}</style></head><body><div class="container"><div class="header"><img src="https://i.imgur.com/wTB9RVY.png" alt="Logo" class="logo"><h1>Welcome to GrocerTease!</h1></div><div class="notice"><p>Notice: This website is a demo, and no actual deliveries will take place. Thank you for understanding.</p></div><div class="content"><p>Dear ${email},</p><p>Thank you for signing up with [Your Store Name]! We're delighted to have you as part of our community.</p><p>As a member, you'll enjoy exclusive benefits such as:</p><ul><li>Access to the freshest groceries and produce at your fingertips.</li><li>Exclusive discounts and special offers on your favorite items.</li><li>Personalized recommendations based on your preferences.</li><li>Early notifications about new products and upcoming promotions.</li></ul><p>To get started, explore our wide range of products and see what we have in store for you.</p><p><a href="https://grocertease.vercel.app" class="btn">Start Shopping</a></p><p>If you have any questions or need assistance, our customer support team is here to help. Feel free to contact us anytime.</p><p>Welcome aboard!</p><p>Best Regards,</p><p>The GrocerTease Team</p></div></div></body></html>`;
      return {
        subject: 'Welcome to GrocerTease!',
        bodyHtml: template,
        bodyText: template,
      };
    }
    if (type == 'SUBSCRIPTION') {
      const { email } = values;
      const template = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Welcome to [Your Store Name]!</title><style>body{font-family:Arial,sans-serif;background-color:#f5f5f5;margin:0;padding:0}.container{width:100%;max-width:600px;margin:0 auto;background-color:#fff;padding:20px;box-shadow:0 0 10px rgba(0,0,0,.1)}.header{text-align:center;padding-bottom:20px}.logo{width:100px;margin-bottom:10px}.content{color:#333;line-height:1.6}.footer{margin-top:20px;text-align:center;font-size:12px;color:#888}.notice{margin-top:20px;padding:15px;background-color:#ff6f61;color:#fff;text-align:center;font-weight:700;border-radius:5px}</style></head><body><div class="container"><div class="header"><img src="https://i.imgur.com/wTB9RVY.png" alt="Logo" class="logo"><h1>Welcome to GrocerTease!</h1></div><div class="notice"><p>Notice: This website is a demo, and no actual deliveries will take place. Thank you for understanding.</p></div><div class="content"><p>Dear ${email},</p><p>Thank you for subscribing to our newsletter! We're thrilled to have you on board.</p><p>At GrocerTease, we're passionate about bringing you the freshest groceries and produce right to your doorstep. Stay tuned for exciting updates, special offers, and delicious recipes that will make your shopping experience delightful.</p><p>We can't wait to share the best of what we have to offer with you. If you have any questions or feedback, feel free to reach out to us at any time.</p><p>Happy shopping!</p><p>Best Regards,</p><p>GrocerTease Team</p></div></div></body></html>`;
      return {
        subject: 'Welcome to GrocerTease Newsletter!',
        bodyHtml: template,
        bodyText: template,
      };
    }
    if (type == 'ORDER') {
      const { order, name } = values;
      const template = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Order Confirmation - [Your Store Name]</title><style>body{font-family:Arial,sans-serif;background-color:#f5f5f5;margin:0;padding:0}.container{width:100%;max-width:600px;margin:0 auto;background-color:#fff;padding:20px;box-shadow:0 0 10px rgba(0,0,0,.1)}.header{text-align:center;padding-bottom:20px}.logo{width:100px;margin-bottom:10px}.content{color:#333;line-height:1.6}.order-info{margin-top:20px}.order-info h2{margin-bottom:10px;color:#1f3a93}.order-details{margin-bottom:20px}.order-details p{margin:5px 0}.item{display:flex;align-items:center;margin-top:20px;border-bottom:1px solid #ccc;padding-bottom:15px}.item img{width:80px;height:80px;margin-right:15px;border-radius:5px}.item-info{flex-grow:1}.item-info p{margin:5px 0}.item-subtotal{font-weight:700;color:#ff6f61}.total{margin-top:20px;font-size:18px;font-weight:700;color:#1f3a93;text-align:right}.notice{margin-top:20px;padding:15px;background-color:#ff6f61;color:#fff;text-align:center;font-weight:700;border-radius:5px}</style></head><body><div class="container"><div class="header"><img src="https://i.imgur.com/wTB9RVY.png" alt="Logo" class="logo"><h1>Thank You for Your Order!</h1></div><div class="notice"><p>Notice: This website is a demo, and no actual deliveries will take place. Thank you for understanding.</p></div><div class="content"><p>Dear ${name},</p><p>We are delighted to confirm that your order has been placed successfully. Here are the details:</p><div class="order-info"><h2>Order Summary</h2><div class="order-details"><p><strong>Order Number:</strong>&nbsp;${order.id}</p><p><strong>Order Date:</strong>&nbsp;${dayjs(order.date).format('D MMM YYYY')}</p><p><strong>Total Amount:</strong>&nbsp;$${order.totalAmount}</p></div><h2>Ordered Items</h2>${order.items.map((i) => `<div class="item"><img src="${i.imageUrl}" alt="${i.name}"><div class="item-info">${i.brand ? `<p><em>${i.brand}</em></p>` : ''}<p><strong>${i.name}</strong></p><p>${i.quantity} ea.</p><p><strong>$${i.unitPrice} /</strong>&nbsp;<em>${i.size}</em></p><p class="item-subtotal"><strong>Subtotal:</strong>&nbsp;$${i.unitPrice * i.quantity}</p></div></div>`)}<p class="total">Total: $${order.totalAmount}</p></div></div></div></body></html>`;
      return {
        subject: 'Your Order Confirmation',
        bodyHtml: template,
        bodyText: template,
      };
    }
  }
}
