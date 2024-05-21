import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CartItem {
  @Field()
  productId: string;

  @Field()
  quantity: number;
}

@ObjectType()
export class Cart {
  @Field()
  id: string;

  @Field(() => [CartItem])
  items: CartItem[];

  @Field()
  userId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
