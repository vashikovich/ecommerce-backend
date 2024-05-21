import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Cart } from './entities/cart.entity';
import { CartService } from './cart.service';
import { CreateCartInput } from './dto/create-cart.input';

@Resolver(() => Cart)
export class CartResolver {
  constructor(private cartService: CartService) {}

  @Query(() => Cart)
  async cart(@Args('id') id: string) {
    return this.cartService.getCartById(id);
  }

  @Query(() => [Cart])
  async cartsByUser(@Args('userId') userId: string) {
    return this.cartService.getCartsByUserId(userId);
  }

  @Mutation(() => Cart)
  async createCart(@Args('cart') cart: CreateCartInput) {
    return this.cartService.createCart(cart);
  }
}
