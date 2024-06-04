import { ArgsType, Int, Field } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true })
  first: number;

  @Field(() => String, { nullable: true })
  after: string;
}
