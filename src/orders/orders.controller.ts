import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrdersService } from './orders.service';

type AuthenticatedRequest = Request & {
  user: {
    id: string;
    name: string;
    email: string;
  };
};

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: 'Order created successfully',
  })
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.create(request.user.id, createOrderDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: 'Returns order details for the logged-in customer',
  })
  findById(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.ordersService.findByIdForUser(id, request.user.id);
  }
}