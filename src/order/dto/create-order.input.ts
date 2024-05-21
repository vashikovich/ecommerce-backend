import { InputType, Field } from '@nestjs/graphql';
import { CartItemInput } from '../../cart/dto/create-cart.input';

@InputType()
export class CreateOrderInput {
  @Field()
  userId: string;

  @Field(() => [CartItemInput])
  items: CartItemInput[];

  @Field()
  totalAmount: number;

  @Field()
  status: string;
}
