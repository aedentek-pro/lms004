import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: 'http://localhost:5173', // Or your frontend URL
    credentials: true,
  });

  // Use cookie parser middleware
  app.use(cookieParser());

  // Global Validation Pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip away properties that do not have any decorators
    transform: true, // Automatically transform payloads to be objects typed according to their DTO classes
  }));

  // API Prefix
  app.setGlobalPrefix('api');

  // Swagger (OpenAPI) Documentation
  const config = new DocumentBuilder()
    .setTitle('Purple LMS API')
    .setDescription('The API documentation for the Purple Learning Management System.')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT || 3001);
}
bootstrap();
