// src/auth/auth.resolver.ts
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UpdateUserInput } from './dto/update-user.input';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from './decorators/user.decorator';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(JwtGuard)
  async currentUser(@CurrentUser() user: User) {
    delete user.passwordHash;
    return user;
  }

  @Mutation(() => User)
  @UseGuards(JwtGuard)
  async updateUser(
    @CurrentUser() user: User,
    @Args('input') input: UpdateUserInput,
  ) {
    return this.userService.updateUser(user.id, input);
  }
}
