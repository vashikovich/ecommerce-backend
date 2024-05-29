import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { CartItem } from './entities/cart.entity';
import { CartService } from './cart.service';
import { ProductService } from 'src/product/product.service';
import { Product } from 'src/product/entities/product.entity';

@Resolver(() => CartItem)
export class CartItemResolver {
  constructor(
    private cartService: CartService,
    private productService: ProductService,
  ) {}

  @ResolveField(() => [Product])
  product(@Parent() cartItem: CartItem) {
    const prod = this.productService.getProductById(cartItem.productId);
    return prod;
  }
}
