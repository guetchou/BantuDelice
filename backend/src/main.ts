// Polyfill pour crypto (nécessaire pour TypeORM) - DOIT être en premier
import { webcrypto } from 'crypto';
if (typeof globalThis.crypto === 'undefined') {
  (globalThis as any).crypto = webcrypto;
}

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration WebSocket
  app.useWebSocketAdapter(new IoAdapter(app));

  // Set global prefix
  app.setGlobalPrefix('api');

  // Enable CORS
  app.enableCors({
    origin: (origin, callback) => {
      const allowed = ['http://localhost:9595', 'http://localhost:3000', 'http://10.10.0.5:9595'];
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: false, // Permettre les propriétés supplémentaires
    transform: true,
  }));

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('BantuDelice API')
    .setDescription('API pour la plateforme BantuDelice - Livraison et services')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Authentification')
    .addTag('users', 'Gestion des utilisateurs')
    .addTag('services', 'Services disponibles')
    .addTag('orders', 'Commandes')
    .addTag('restaurants', 'Restaurants')
    .addTag('payments', 'Paiements')
    .addTag('notifications', 'Notifications')
    .addTag('tracking', 'Tracking temps réel')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3001;
  await app.listen(port);
  
  console.log(`🚀 BantuDelice API is running on: http://localhost:${port}`);
  console.log(`📚 Swagger documentation: http://localhost:${port}/api`);
  console.log(`🔌 WebSocket available on: ws://localhost:${port}/tracking`);
}
bootstrap();
