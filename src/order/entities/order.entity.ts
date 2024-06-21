import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

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

  @Field(() => [OrderItem])
  items: OrderItem[];

  @Field()
  totalAmount: number;

  @Field()
  date: string;

  @Field()
  status: string;
}
