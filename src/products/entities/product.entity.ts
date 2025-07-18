import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', {
    unique: true
  })
  title: string;

  @Column('float', {
    default: 0
  }) //Indica que es una calumna el tipo y luego configuraciones a ese campo
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

  @Column('text',{
    array: true,
    default: []
  })
  tags: string[];

  //images

  @BeforeInsert()
  checkSlugInsert(){
    if(!this.slug) this.slug = this.title

    this.slug = this.slug
    .toLowerCase()
    .replaceAll(' ', '_')
    .replaceAll("'", '')
  }

  // BeforeUpdate
  @BeforeUpdate()
  checkSlugUpdate(){
    this.slug = this.slug
    .toLowerCase()
    .replaceAll(' ', '_')
    .replaceAll("'", '')
  }
}
