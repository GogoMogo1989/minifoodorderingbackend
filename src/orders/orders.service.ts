import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { RestaurantsService } from '../restaurants/restaurants.service';
import { MenuItem } from '../restaurants/schemas/restaurant.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';

type MenuItemWithId = MenuItem & {
  _id: Types.ObjectId;
};

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private readonly orderModel: Model<OrderDocument>,
    private readonly restaurantsService: RestaurantsService,
  ) {}

  async create(userId: string, createOrderDto: CreateOrderDto) {
    const restaurant = await this.restaurantsService.findDocumentById(
      createOrderDto.restaurantId,
    );

    const orderItems = createOrderDto.items.map((item) => {
      const menuItem = restaurant.menu.find((menuItem) => {
        const menuItemWithId = menuItem as MenuItemWithId;

        return String(menuItemWithId._id) === item.menuItemId;
      });

      if (!menuItem) {
        throw new BadRequestException(
          `Menu item not found: ${item.menuItemId}`,
        );
      }

      const menuItemWithId = menuItem as MenuItemWithId;
      const lineTotal = menuItemWithId.price * item.quantity;

      return {
        menuItemId: String(menuItemWithId._id),
        name: menuItemWithId.name,
        price: menuItemWithId.price,
        quantity: item.quantity,
        lineTotal,
      };
    });

    const totalPrice = orderItems.reduce((sum, item) => {
      return sum + item.lineTotal;
    }, 0);

    const order = await this.orderModel.create({
      userId: new Types.ObjectId(userId),
      restaurantId: new Types.ObjectId(createOrderDto.restaurantId),
      restaurantName: restaurant.name,
      items: orderItems,
      totalPrice,
      status: OrderStatus.PENDING,
    });

    return this.toOrderResponse(order);
  }

  async findByIdForUser(orderId: string, userId: string) {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new BadRequestException('Invalid order id');
    }

    const order = await this.orderModel
    .findOne({
        _id: new Types.ObjectId(orderId),
        userId: new Types.ObjectId(userId),
    })
    .exec();

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.toOrderResponse(order);
  }

  private toOrderResponse(order: OrderDocument) {
    return {
      id: String(order._id),
      restaurantId: String(order.restaurantId),
      restaurantName: order.restaurantName,
      items: order.items,
      totalPrice: order.totalPrice,
      status: order.status,
    };
  }
}