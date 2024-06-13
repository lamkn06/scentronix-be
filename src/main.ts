import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { contentParser } from 'fastify-multer';

import { AppModule } from './app.module';

const API_VERSION = 'v1';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix(API_VERSION);

  const configService: ConfigService = app.get(ConfigService);

  app.enableCors({
    origin: configService.get('CORS_ORIGIN'),
  });

  const config = new DocumentBuilder()
    .setTitle('Node API')
    .setDescription('Node API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(API_VERSION, app, document);

  app.register(contentParser);

  await app.listen(configService.get('port'), '0.0.0.0');
}

bootstrap();
