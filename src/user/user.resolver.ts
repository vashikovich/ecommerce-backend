// src/auth/auth.resolver.ts
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { GraphqlAuthGuard } from 'src/auth/guards/graphql-auth.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from './decorators/user.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(GraphqlAuthGuard)
  async currentUser(@CurrentUser() user: User) {
    delete user.passwordHash;
    return user;
  }

  @Mutation(() => User)
  @UseGuards(GraphqlAuthGuard)
  async updateUser(
    @CurrentUser() user: User,
    @Args('input') input: UpdateUserInput,
  ) {
    return this.userService.updateUser(user.id, input);
  }
}
