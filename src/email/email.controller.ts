import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { NewsletterDto } from './dto/newsletter.dto';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('newsletter')
  async register(@Body(ValidationPipe) newsletterDto: NewsletterDto) {
    const { email } = newsletterDto;
    await this.emailService.sendEmail(email, 'SUBSCRIPTION', { email });
    return true;
  }
}
