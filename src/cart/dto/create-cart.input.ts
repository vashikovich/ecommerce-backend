import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateCartInput {
  @Field()
  userId: string;

  @Field(() => [CartItemInput])
  items: CartItemInput[];
}

@InputType()
export class CartItemInput {
  @Field()
  productId: string;

  @Field()
  quantity: number;
}
