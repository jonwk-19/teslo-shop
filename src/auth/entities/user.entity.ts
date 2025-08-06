import { ApiProperty } from "@nestjs/swagger";
import { Product } from "src/products/entities";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
  @ApiProperty({
    example: 'a0f4b1aa-11ed-4e0b-90ff-47e1b05d6a6b',
    description: 'User ID (UUID)',
  })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({
    example: 'john@example.com',
    description: 'Unique email address',
  })
  @Column('text', {
    unique: true,
  })
  email: string;

  @ApiProperty({
    example: '********',
    description: 'Password (hashed)',
    writeOnly: true, // Hidden in Swagger response
  })
  @Column('text', {
    select: false,
  })
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'Full name of the user',
  })
  @Column('text')
  fullName: string;

  @ApiProperty({
    example: true,
    description: 'User active status',
    default: true,
  })
  @Column('bool', {
    default: true,
  })
  isActive: boolean;

  @ApiProperty({
    example: ['user'],
    description: 'Roles assigned to the user',
    isArray: true,
    default: ['user'],
  })
  @Column('text', {
    array: true,
    default: ['user'],
  })
  roles: string[];

  @ApiProperty({
    type: () => [Product],
    description: 'List of products created by the user',
  })
  @OneToMany(
    () => Product,
    (product) => product.user,
  )
  product: Product[];

  @BeforeInsert()
  checkFieldsBeforeInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsBeforeUpdate() {
    this.email = this.email.toLowerCase().trim();
  }
}
