import { Resolver, Query, Context, Args, Mutation } from '@nestjs/graphql';
import { Cart } from './entities/cart.entity';
import { CartService } from './cart.service';
import { UserService } from 'src/user/user.service';

@Resolver(() => Cart)
export class CartResolver {
  constructor(
    private cartService: CartService,
    private userService: UserService,
  ) {}

  @Query(() => Cart)
  async cart(@Context('token') token: string) {
    const user = await this.userService.validateToken(token);
    return this.cartService.getCartByUserId(user.uid);
  }

  @Mutation(() => Cart)
  async addProductToCart(
    @Context('token') token: string,
    @Args('productId') productId: string,
  ) {
    const user = await this.userService.validateToken(token);
    return await this.cartService.addProductToCart(user.uid, productId);
  }

  @Mutation(() => Cart)
  async changeCartProductQuantity(
    @Context('token') token: string,
    @Args('productId') productId: string,
    @Args('quantity') quanity: number,
  ) {
    const user = await this.userService.validateToken(token);
    return await this.cartService.changeCartProductQuantity(
      user.uid,
      productId,
      quanity,
    );
  }
}
