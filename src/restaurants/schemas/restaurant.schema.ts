import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RestaurantDocument = HydratedDocument<Restaurant>;

@Schema()
export class MenuItem {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    trim: true,
  })
  description?: string;

  @Prop({
    required: true,
    min: 0,
  })
  price!: number;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);

@Schema({
  timestamps: true,
})
export class Restaurant {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    trim: true,
  })
  description?: string;

  @Prop({
    trim: true,
  })
  address?: string;

  @Prop({
    type: [MenuItemSchema],
    default: [],
  })
  menu!: MenuItem[];
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);