import {
  Resolver,
  Query,
  Args,
  Mutation,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Cart, CartItem } from './entities/cart.entity';
import { CartService } from './cart.service';
import { User } from 'src/user/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/auth/guards/graphql-auth.guard';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { Product } from 'src/product/entities/product.entity';
import { ProductService } from 'src/product/product.service';

@Resolver(() => Cart)
export class CartResolver {
  constructor(
    private cartService: CartService,
    private productService: ProductService,
  ) {}

  @Query(() => Cart)
  @UseGuards(GraphqlAuthGuard)
  async cart(@CurrentUser() user: User) {
    return this.cartService.getCartByUserId(user.id);
  }

  @ResolveField(() => [Product])
  product(@Parent() cartItem: CartItem) {
    const prod = this.productService.getProductById(cartItem.productId);
    return prod;
  }

  @Mutation(() => Cart)
  @UseGuards(GraphqlAuthGuard)
  async addProductToCart(
    @CurrentUser() user: User,
    @Args('productId') productId: string,
  ) {
    return await this.cartService.addProductToCart(user.id, productId);
  }

  @Mutation(() => Cart)
  @UseGuards(GraphqlAuthGuard)
  async changeCartProductQuantity(
    @CurrentUser() user: User,
    @Args('productId') productId: string,
    @Args('quantity') quanity: number,
  ) {
    return await this.cartService.changeCartProductQuantity(
      user.id,
      productId,
      quanity,
    );
  }
}
