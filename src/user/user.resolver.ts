// src/auth/auth.resolver.ts
import { Resolver, Mutation, Args, Context, Query } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UpdateProfileInput } from './dto/update-profile.input';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly authService: UserService) {}

  @Mutation(() => User)
  async register(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    return this.authService.register(email, password);
  }

  @Mutation(() => String)
  async login(
    @Args('email') email: string,
    @Args('password') password: string,
  ) {
    const { token } = await this.authService.login(email, password);
    return token;
  }

  @Mutation(() => User)
  async verifyToken(@Args('token') token: string) {
    return this.authService.verifyToken(token);
  }

  @Query(() => User)
  async currentUser(@Context('token') token: string) {
    const user = await this.authService.validateToken(token);
    return user;
  }

  @Mutation(() => User)
  async updateProfile(
    @Context('token') token: string,
    @Args('input') input: UpdateProfileInput,
  ) {
    const user = await this.currentUser(token);
    return this.authService.updateProfile(user.uid, input);
  }
}
