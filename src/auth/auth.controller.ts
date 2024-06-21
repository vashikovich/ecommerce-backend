import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UseGuards,
  Get,
  Req,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtGuard } from './guards/jwt.guard';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { GoogleGuard } from './guards/google.guard';
import { base64 } from 'src/common/utils';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    const { email, password } = registerDto;
    const user = await this.authService.register(email, password);
    const tokenInfo = await this.authService.login(email, password);
    return { user, tokenInfo };
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    const { email, password } = loginDto;
    const tokenInfo = await this.authService.login(email, password);
    const user = await this.authService.getUserFromToken(tokenInfo.accessToken);
    return { user, tokenInfo };
  }

  @UseGuards(JwtGuard)
  @Post('logout')
  async logout(@CurrentUser() user: User) {
    await this.authService.logout(user.id);
  }

  @Post('refresh')
  async refresh(
    @Body() { userId, refreshToken }: { userId: string; refreshToken: string },
  ) {
    const tokenInfo = await this.authService.refreshTokens(
      userId,
      refreshToken,
    );
    const user = await this.authService.getUserFromToken(tokenInfo.accessToken);
    return { user, tokenInfo };
  }

  @Get('google')
  @UseGuards(GoogleGuard)
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleAuthRedirect(@Req() req: any, @Res() res: Response) {
    const { username } = req.user;
    const tokenInfo = await this.authService.loginViaProvider(username);
    const user = await this.authService.getUserFromToken(tokenInfo.accessToken);
    const code = base64.encode({ user, tokenInfo });
    res.redirect(`${process.env.WEB_HOST}/user/login/provider?code=${code}`);
  }
}
