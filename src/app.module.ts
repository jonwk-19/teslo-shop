import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({}),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT!,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      synchronize: true, // Cuando se hace un cambio en las entidades, se actualiza la base de datos automáticamente
      logging: true, // Muestra los logs de las consultas SQL
      autoLoadEntities: true, // Carga automáticamente las entidades definidas en el proyecto
    }),
    ProductsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
