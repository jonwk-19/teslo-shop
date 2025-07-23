import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage, Product } from './entities';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(

    @InjectRepository(Product)
    private readonly productRespository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImagesRespository: Repository<ProductImage>,

    private readonly dataSource: DataSource,

  ){}

  async create(createProductDto: CreateProductDto) {

    try {
      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRespository.create({
        ...productDetails,
        images: images.map(image => this.productImagesRespository.create({ url: image}))
      });
      await this.productRespository.save(product)
      return {...product, images};

    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRespository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true,
      }
    });

    return products.map(product => ({
      ...product,
      images: (product.images!).map( img => img.url )
    }))
  }

  async findOne(term: string ) {

    let product: Product | null = null;
    if (isUUID(term)){
      product = await this.productRespository.findOneBy({id: term})
    } else {
      const queryBuilder = this.productRespository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne()
    }

      if(!product) throw new NotFoundException(`Product with term "${term}" not found`)
      return product
  }

  async findOnePlain( term: string ){
    const {images = [], ...rest} = await this.findOne(term)
    return{
      ...rest,
      images: images.map(image => image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {

    const {images, ...toUpdate} = updateProductDto;

    const product = await this.productRespository.preload({ id, ...toUpdate});

    if (!product) throw new NotFoundException(`Product with id: ${id} not found`)

    // Create query runner
    // Este sirve para hcer transacciones
    const queryRunner =  this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();


    try {
      if( images ){
        //Aca puede ser productId pero typeORM lo puede leer como product porque detecta la relcion
        await queryRunner.manager.delete(ProductImage, { product: { id } })

        product.images = images.map(
          image => this.productImagesRespository.create({url: image})
        )
      } else {
        //??
        //?? images
      }
      await queryRunner.manager.save(product)
      //NOSONAR
      // await this.productRespository.save([product]);

      await queryRunner.commitTransaction();
      await queryRunner.release()
      // return product;
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.handleDBExceptions(error)
    }
  }

  async remove(id: string) {
    const { affected } = await this.productRespository.delete(id)
    if ( affected === 0 ) throw new NotFoundException(`Product with id "${id}" not found`)
  }

  private handleDBExceptions( error: any){
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if(error.code === '23505')
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        throw new BadRequestException(error.detail);

      this.logger.error(error)
      throw new InternalServerErrorException('Unexpected error, check server logs!')
  }

  async deleteAllProducts(){
    const query = this.productRespository.createQueryBuilder('product');

    try {
      return await query
      .delete()
      .where({})
      .execute()
    } catch (error) {
      this.handleDBExceptions(error)

    }

  }
}
