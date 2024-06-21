import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { TokenInfoOutput } from './dto/token-info.output';
import { EmailService } from 'src/email/email.service';
import { User } from 'src/user/entities/user.entity';
import * as argon2 from 'argon2';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}

  async register(email: string, password: string) {
    const existing = await this.userService.findByEmail(email);
    if (existing) throw new UnauthorizedException('Email already registered');

    const user = await this.userService.createUser(email, password);
    await this.emailService.sendEmail(email, 'SIGN_UP', { email });

    delete user.passwordHash;
    delete user.refreshTokenHash;

    return user;
  }

  async login(email: string, password: string) {
    const user = await this.userService.findByEmail(email);

    if (user && user.passwordHash === undefined) {
      throw new UnauthorizedException('Please sign in using providers');
    }

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokenInfo = this.createToken(user);
    await this.updateRefreshToken(user.id, tokenInfo.refreshToken);

    return tokenInfo;
  }

  async loginViaProvider(email: string) {
    const user = await this.userService.findByEmail(email);

    if (user) {
      const tokenInfo = this.createToken(user);
      await this.updateRefreshToken(user.id, tokenInfo.refreshToken);

      return tokenInfo;
    } else {
      const newUser = await this.userService.createUser(email);
      await this.emailService.sendEmail(email, 'SIGN_UP', { email });

      const tokenInfo = this.createToken(newUser);
      await this.updateRefreshToken(newUser.id, tokenInfo.refreshToken);

      return tokenInfo;
    }
  }

  private createToken(user: User): TokenInfoOutput {
    const payload = { email: user.email, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '1m' }),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '30d' }),
    };
  }

  async getUserFromToken(token: string): Promise<User> {
    try {
      const payload = this.jwtService.verify(token);
      const user = await this.userService.findById(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      delete user.passwordHash;
      delete user.refreshTokenHash;

      return user;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  async logout(userId: string) {
    await this.userService.updateUser(userId, {
      refreshTokenHash: null,
    });
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    const hashedToken = await argon2.hash(refreshToken);
    await this.userService.updateUser(userId, {
      refreshTokenHash: hashedToken,
    });
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.userService.findById(userId);
    if (!user || !user.refreshTokenHash)
      throw new ForbiddenException('Access Denied');
    const refreshTokenMatches = await argon2.verify(
      user.refreshTokenHash,
      refreshToken,
    );
    if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
    const tokenInfo = this.createToken(user);
    await this.updateRefreshToken(userId, tokenInfo.refreshToken);
    return tokenInfo;
  }
}
