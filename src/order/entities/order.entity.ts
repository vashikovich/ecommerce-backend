import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { CartItem } from '../../cart/entities/cart.entity';

@ObjectType()
export class OrderItem {
  @Field()
  productId: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  brand?: string;

  @Field()
  size: string;

  @Field()
  imageUrl: string;

  @Field(() => Float)
  unitPrice: number;

  @Field(() => Int)
  quantity: number;
}

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
