import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity()
export class Product {

  @ApiProperty({
    example: '720d71c7-efda-44cc-bbfe-cab993ed2e17',
    description: 'Unique UUID of the product',
    uniqueItems: true
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'Teslo T-Shirt',
    description: 'Unique title of the product',
    uniqueItems: true
  })
  @Column('text', {
    unique: true
  })
  title: string;

  @ApiProperty({
    example: 29.99,
    description: 'Product price',
  })
  @Column('float', {
    default: 0
  }) //? Indica que es una columna, el tipo y luego configuraciones a ese campo
  price: number;

  @ApiProperty({
    example: 'This is a brand new Teslo T-shirt, very comfortable and stylish.',
    description: 'Optional product description',
    default: null
  })
  @Column({
    type: 'text',
    nullable: true
  })
  description: string;

  @ApiProperty({
    example: 'teslo_t_shirt',
    description: 'Product slug (used for SEO and URLs), auto-generated if not provided',
    uniqueItems: true
  })
  @Column('text', {
    unique: true
  })
  slug: string;

  @ApiProperty({
    example: 100,
    description: 'Available product quantity in inventory'
  })
  @Column('int', {
    default: 0
  })
  stock: number;

  @ApiProperty({
    example: ['XS', 'S', 'M', 'L', 'XL'],
    description: 'Available product sizes'
  })
  @Column('text', {
    array: true
  })
  sizes: string[];

  @ApiProperty({
    example: 'unisex',
    description: 'Target gender for the product (e.g., men, women, kid, unisex)'
  })
  @Column('text')
  gender: string;

  @ApiProperty({
    example: ['new', 'sale', 'popular'],
    description: 'Tags related to the product',
    default: []
  })
  @Column('text', {
    array: true,
    default: []
  })
  tags: string[];

  @ApiProperty({
    type: () => [ProductImage],
    description: 'Images associated with the product',
    example: [
      { url: 'https://example.com/image1.jpg' },
      { url: 'https://example.com/image2.jpg' }
    ]
  })
  @OneToMany(
    () => ProductImage,
    (productImage) => productImage.product,
    { cascade: true, eager: true }
  )
  images?: ProductImage[];

  @ApiProperty({
    type: () => User,
    description: 'User who created or modified the product'
  })
  @ManyToOne(
    () => User,
    (user) => user.product,
    { eager: true } //? Para que cuando se hagan consultas cargue en auto la relación
  )
  user: User;

  @BeforeInsert()
  checkSlugInsert() {
    if (!this.slug) this.slug = this.title;

    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }

  @BeforeUpdate()
  checkSlugUpdate() {
    this.slug = this.slug
      .toLowerCase()
      .replaceAll(' ', '_')
      .replaceAll("'", '');
  }
}
