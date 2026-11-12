import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

// Punto de entrada: configura y levanta la aplicación.
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Todas las rutas quedan bajo /api/v1
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Valida y transforma los DTOs; rechaza campos que no estén definidos.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Documentación Swagger con soporte para token Bearer.
  const swaggerConfig = new DocumentBuilder()
    .setTitle('BarberShop API')
    .setDescription('API Documentation for BarberShop (NestJS)')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);

  // Interfaz disponible en /api/v1/docs
  SwaggerModule.setup('api/v1/docs', app, document, {
    swaggerOptions: {
      docExpansion: 'list',
      defaultModelsExpandDepth: -1,
      filter: true,
      showRequestDuration: true,
      persistAuthorization: true,
      tryItOutEnabled: false,
    },
  });

  await app.listen(process.env.APP_PORT ?? 3000);
}
void bootstrap();
