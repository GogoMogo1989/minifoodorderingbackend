import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class CreateMenuItemDto {
  @ApiProperty({
    example: 'Margherita Pizza',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'Tomato sauce, mozzarella and fresh basil.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 2890,
  })
  @IsNumber()
  @Min(0)
  price!: number;
}

export class CreateRestaurantDto {
  @ApiProperty({
    example: 'Bella Napoli',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: 'Italian restaurant with pizza and pasta.',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    example: 'Budapest, Fő utca 12.',
    required: false,
  })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiProperty({
    type: [CreateMenuItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMenuItemDto)
  menu!: CreateMenuItemDto[];
}