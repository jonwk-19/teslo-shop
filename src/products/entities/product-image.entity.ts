import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "./product.entity";
import { ApiProperty } from "@nestjs/swagger";


@Entity()
export class ProductImage{

  @ApiProperty({
    description: 'Unique identifier for the image',
    example: 1,
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'URL pointing to the product image',
    example: 'https://mydomain.com/images/product123.jpg',
  })
  @Column('text')
  url: string;

  @ManyToOne(
    () => Product,
    ( product ) => product.images,
    { onDelete: 'CASCADE'}
  )
  product: Product;
}
