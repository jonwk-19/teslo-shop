import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";

export class CreateProductDto {

  @IsString()
  @MinLength(1)
  title: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  slug?: string;

  @IsInt()
  @IsPositive()
  @IsOptional()
  stock?: number;

  @IsString({each: true})
  @IsArray()
  sizes: string[];

  @IsIn(['men', 'women', 'kid', 'unisex'])
  @IsString({each: true})
  // @IsArray() // no me acurdo si iba o no pero lo quite y jalo
  gender: string
}
