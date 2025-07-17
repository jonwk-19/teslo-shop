import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  title: string;

  @Column('numeric', {default: 0}) //Indica que es una calumna el tipo y luego configuraciones a ese campo
  price: number;

  // otra forma de definir es:
  @Column({
    type: 'text',
    nullable: true
})
  description: string;

  @Column('text', {
    unique: true
  })
  slug: string;

  @Column('int', {
    default: 0
  })
  stock: number;

  @Column('text',{
    array: true
  })
  sizes: string[];

  @Column('text')
  gender: string;

  //tags
  //images
}
