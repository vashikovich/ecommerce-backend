import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CartItem {
  @Field()
  productId: string;

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
