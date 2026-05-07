import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  MenuItem,
  Restaurant,
  RestaurantDocument,
} from './schemas/restaurant.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';

type MenuItemWithId = MenuItem & {
  _id: Types.ObjectId;
};

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restaurantModel: Model<RestaurantDocument>,
  ) {}

  async create(createRestaurantDto: CreateRestaurantDto) {
    const restaurant = await this.restaurantModel.create(createRestaurantDto);

    return this.toRestaurantDetails(restaurant);
  }

  async findAll() {
    const restaurants = await this.restaurantModel.find().exec();

    return restaurants.map((restaurant) => ({
      id: String(restaurant._id),
      name: restaurant.name,
      description: restaurant.description,
      address: restaurant.address,
    }));
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid restaurant id');
    }

    const restaurant = await this.restaurantModel.findById(id).exec();

    if (!restaurant) {
      throw new NotFoundException('Restaurant not found');
    }

    return this.toRestaurantDetails(restaurant);
  }

  private toRestaurantDetails(restaurant: RestaurantDocument) {
    return {
      id: String(restaurant._id),
      name: restaurant.name,
      description: restaurant.description,
      address: restaurant.address,
      menu: restaurant.menu.map((item) => {
        const menuItem = item as MenuItemWithId;

        return {
          id: String(menuItem._id),
          name: menuItem.name,
          description: menuItem.description,
          price: menuItem.price,
        };
      }),
    };
  }
}