import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { CreateOrderInput } from './dto/create-order.input';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  @Query(() => Order)
  async order(@Args('id') id: string) {
    return this.orderService.getOrderById(id);
  }

  @Query(() => [Order])
  async ordersByUser(@Args('userId') userId: string) {
    return this.orderService.getOrdersByUserId(userId);
  }

  @Mutation(() => Order)
  async createOrder(@Args('order') order: CreateOrderInput) {
    return this.orderService.createOrder(order);
  }
}
