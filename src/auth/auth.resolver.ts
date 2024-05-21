// src/auth/auth.resolver.ts
import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => User)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async register(@Args('email') email: string, @Args('password') password: string) {
    return this.authService.register(email, password);
  }

  @Mutation(() => String)
  async login(@Args('email') email: string, @Args('password') password: string) {
    const { token } = await this.authService.login(email, password);
    return token;
  }

  @Mutation(() => User)
  async verifyToken(@Args('token') token: string) {
    return this.authService.verifyToken(token);
  }

  @Mutation(() => User)
  async currentUser(@Context('token') token: string) {
    const user = await this.authService.validateToken(token);
    return user;
  }
}
