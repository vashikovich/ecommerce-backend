import { Resolver, Query, Args, Mutation, Int } from '@nestjs/graphql';
import { Cart } from './entities/cart.entity';
import { CartService } from './cart.service';
import { User } from 'src/user/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/user/decorators/user.decorator';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private cartService: CartService) {}

  @Query(() => Cart)
  @UseGuards(JwtGuard)
  async cart(@CurrentUser() user: User) {
    return this.cartService.getCartByUserId(user.id);
  }

  @Mutation(() => Cart)
  @UseGuards(JwtGuard)
  async addProductToCart(
    @CurrentUser() user: User,
    @Args('productId') productId: string,
  ) {
    return await this.cartService.addProductToCart(user.id, productId);
  }

  @Mutation(() => Cart)
  @UseGuards(JwtGuard)
  async changeCartProductQuantity(
    @CurrentUser() user: User,
    @Args('productId') productId: string,
    @Args('quantity', { type: () => Int }) quanity: number,
  ) {
    return await this.cartService.changeCartProductQuantity(
      user.id,
      productId,
      quanity,
    );
  }
}
