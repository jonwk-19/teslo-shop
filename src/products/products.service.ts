import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(

    @InjectRepository(Product)
    private readonly productRespository: Repository<Product>,

  ){}

  async create(createProductDto: CreateProductDto) {

    try {

      const product = this.productRespository.create(createProductDto);
      await this.productRespository.save(product)
      return product;

    } catch (error) {
      this.handleDBExceptions(error)
    }
  }

  // TODO: Paginar
  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return await this.productRespository.find({
      take: limit,
      skip: offset,
      // TODO: relaciones
    });
  }

  async findOne(id: string ) {
      const product = await this.productRespository.findOneBy({id})
      if(!product) throw new NotFoundException(`Product with id "${id}" not found`)
      return product
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
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
}
