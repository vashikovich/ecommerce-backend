// src/auth/auth.resolver.ts
import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async verifyToken(@Args('token') token: string) {
    return this.userService.verifyToken(token);
  }

  @Query(() => User)
  async currentUser(@Context('token') token: string) {
    const user = await this.userService.validateToken(token);
    return user;
  }
}
