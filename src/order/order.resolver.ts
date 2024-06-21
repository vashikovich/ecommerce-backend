import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { Order } from './entities/order.entity';
import { OrderService } from './order.service';
import { CurrentUser } from 'src/user/decorators/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { UseGuards } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Resolver(() => Order)
export class OrderResolver {
  constructor(private orderService: OrderService) {}

  @Query(() => Order)
  @UseGuards(JwtGuard)
  async order(@CurrentUser() user: User, @Args('id') id: string) {
    return this.orderService.getOrderById(id, user.id);
  }

  @Query(() => [Order])
  @UseGuards(JwtGuard)
  async ordersByUser(@CurrentUser() user: User) {
    return this.orderService.getOrdersByUserId(user.id);
  }

  @Mutation(() => Order)
  @UseGuards(JwtGuard)
  async createOrder(@CurrentUser() user: User) {
    return this.orderService.createOrder(user.id);
  }
}
