import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateOrderInput {
  @Field()
  userId: string;

  @Field()
  totalAmount: number;

  @Field()
  status: string;
}
