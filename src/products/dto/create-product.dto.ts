import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateProductDto {

  @ApiProperty({
    description: 'Product title (must be unique)',
    example: 'Teslo T-Shirt'
  })
  @IsString()
  @MinLength(1)
  title: string;

  @ApiPropertyOptional({
    description: 'Product price (must be positive)',
    example: 29.99
  })
  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @ApiPropertyOptional({
    description: 'Product description (optional)',
    example: 'This is a high-quality T-shirt made with organic cotton.'
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    description: 'Product slug for SEO (optional, will be generated if not provided)',
    example: 'teslo_t_shirt'
  })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({
    description: 'Product stock count (must be positive)',
    example: 100
  })
  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @ApiProperty({
    description: 'Available product sizes',
    example: ['S', 'M', 'L', 'XL']
  })
  @IsString({ each: true }) //? Valida que cada elemento del array sea string
  @IsArray()
  sizes: string[];

  @ApiProperty({
    description: 'Target gender for the product',
    example: 'unisex',
    enum: ['men', 'women', 'kid', 'unisex']
  })
  @IsIn(['men', 'women', 'kid', 'unisex']) //? Valida que esté dentro de los valores permitidos
  @IsString({ each: true })
  gender: string;

  @ApiPropertyOptional({
    description: 'Tags related to the product',
    example: ['new', 'sale', 'limited-edition']
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags: string[];

  @ApiPropertyOptional({
    description: 'List of image URLs for the product',
    example: [
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg'
    ]
  })
  @IsArray()
  @IsString({ each: true }) //? Valida que cada URL sea string
  @IsOptional()
  images?: string[];
}
