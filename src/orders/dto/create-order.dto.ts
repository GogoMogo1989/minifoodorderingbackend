import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsMongoId,
  Min,
  ValidateNested,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderItemDto {
  @ApiProperty({
    example: '663f1f1f1f1f1f1f1f1f1f1f',
  })
  @IsMongoId()
  menuItemId!: string;

  @ApiProperty({
    example: 2,
  })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateOrderDto {
  @ApiProperty({
    example: '663f1f1f1f1f1f1f1f1f1f1f',
  })
  @IsMongoId()
  restaurantId!: string;

  @ApiProperty({
    type: [CreateOrderItemDto],
  })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}