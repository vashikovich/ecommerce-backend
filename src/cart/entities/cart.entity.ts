import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Product } from 'src/product/entities/product.entity';

@ObjectType()
export class CartItem {
  @Field()
  productId: string;

  @Field(() => Product, { nullable: true })
  product?: Product;

  @Field(() => Int)
  quantity: number;
}

@ObjectType()
export class Cart {
  @Field()
  userId: string;

  @Field(() => [CartItem])
  items: CartItem[];
}
