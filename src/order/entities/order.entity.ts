import { Field, ObjectType } from '@nestjs/graphql';
import { CartItem } from '../../cart/entities/cart.entity';

@ObjectType()
export class Order {
  @Field()
  id: string;

  @Field()
  userId: string;

  @Field(() => [CartItem])
  items: CartItem[];

  @Field()
  totalAmount: number;

  @Field()
  status: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
