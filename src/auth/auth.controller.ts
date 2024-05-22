import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    const { email, password } = registerDto;
    const user = await this.authService.register(email, password);
    const tokenInfo = await this.authService.login(email, password);
    delete user.passwordHash;
    return { user, tokenInfo };
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    const { email, password } = loginDto;
    const tokenInfo = await this.authService.login(email, password);
    const user = await this.authService.getUserFromToken(tokenInfo.accessToken);
    delete user.passwordHash;
    return { user, tokenInfo };
  }
}
