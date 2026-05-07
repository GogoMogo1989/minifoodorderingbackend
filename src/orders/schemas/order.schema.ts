import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, SchemaTypes, Types } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

export enum OrderStatus {
  PENDING = 'PENDING',
}

@Schema({ _id: false })
export class OrderItem {
  @Prop({ required: true })
  menuItemId!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true, min: 1 })
  quantity!: number;

  @Prop({ required: true, min: 0 })
  lineTotal!: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({
  timestamps: true,
})
export class Order {
   @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  })
  userId!: Types.ObjectId;

  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'Restaurant',
    required: true,
  })
  restaurantId!: Types.ObjectId;

  @Prop({ required: true })
  restaurantName!: string;

  @Prop({
    type: [OrderItemSchema],
    default: [],
  })
  items!: OrderItem[];

  @Prop({ required: true, min: 0 })
  totalPrice!: number;

  @Prop({
    enum: OrderStatus,
    default: OrderStatus.PENDING,
  })
  status!: OrderStatus;
}

export const OrderSchema = SchemaFactory.createForClass(Order);