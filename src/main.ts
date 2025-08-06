import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { readFileSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  const config = new DocumentBuilder()
    .setTitle('Teslo RESTFull API')
    .setDescription('Teslo shop endpoints')
    .setVersion('1.0')
    // .addTag('cats') //? son agrupadores no los vamo a agragar directa mente aca por ahora
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  const swaggerDarkTheme = readFileSync(
    join(__dirname, '../api/swaggerDark.css'), // Ajusta ruta según dónde esté el archivo
    'utf8',
  )

  SwaggerModule.setup('api', app, documentFactory, {
    customCss: swaggerDarkTheme
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
