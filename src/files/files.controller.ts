import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileNamer, fileFilter } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('Files - Get and Upload')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService
  ) {}

  @ApiOperation({ summary: 'Get a static product image by filename' })
  @ApiParam({
    name: 'imageName',
    description: 'Image filename (e.g. abc123.jpg)',
    example: 'sample-image.jpg',
  })
  @ApiResponse({ status: 200, description: 'Image file returned' })
  @ApiResponse({ status: 400, description: 'Image not found' })
  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ){
    const path = this.filesService.getStaticProductImage(imageName)

    res.sendFile(path)
  }


  @Post('product')
  @ApiOperation({ summary: 'Upload a new product image' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Image file to upload',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Image uploaded successfully, returns the URL',
    schema: {
      example: {
        secureUrl: 'http://localhost:3000/files/product/your-image.jpg',
      },
    },
  })
  @ApiResponse({ status: 400, description: 'No file uploaded or invalid format' })
  @UseInterceptors( FileInterceptor('file', {
    fileFilter: fileFilter,
    // limits: {fileSize: 1000},
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer,
    })
  }))
  uploadProductImage(
    @UploadedFile()  file: Express.Multer.File
  ){

    if (!file) {
      throw new BadRequestException('Make sure that the file is an image')
    }

    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`
    return { secureUrl };
  }
}
