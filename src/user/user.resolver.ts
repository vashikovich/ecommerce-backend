// src/auth/auth.resolver.ts
import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly authService: UserService) {}

  @Mutation(() => User)
  async verifyToken(@Args('token') token: string) {
    return this.authService.verifyToken(token);
  }

  @Query(() => User)
  async currentUser(@Context('token') token: string) {
    const user = await this.authService.validateToken(token);
    return user;
  }
}
