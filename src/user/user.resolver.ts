import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => [User])
  async users() {
    return this.userService.getAllUsers();
  }

  @Query(() => User)
  async user(@Args('id') id: string) {
    return this.userService.getUserById(id);
  }

  @Mutation(() => User)
  async createUser(@Args('email') email: string) {
    return this.userService.createUser(email);
  }
}
