import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  @Query(() => Order)
  async order(@Args('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @Query(() => [Order])
  async ordersByUser(@CurrentUser() user: User) {
    return this.orderService.getOrdersByUserId(user.id);
  }

  @Mutation(() => Order)
  async createOrder(@CurrentUser() user: User) {
    return this.orderService.createOrder(user.id);
  }
}
