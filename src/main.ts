import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { httpConstants } from './constants';
import { WsAdapter } from '@nestjs/platform-ws';

process.env.TZ = 'Etc/Universal';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    {
      cors: {
        origin: httpConstants.origin
      }
    }
  );

  app.useWebSocketAdapter(new WsAdapter(app));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  )

  const documentConfig = new DocumentBuilder()
    .setTitle('Chat API documentation')
    .setDescription('Developed by Augusto Lautaro Kazalukian (FullStack & mobile)')
    .setVersion('1.0')
    .addTag('Authentication')
    .addTag('Users')
    .addTag('Rooms')
    .addTag('Messages')
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(httpConstants.port, '0.0.0.0');
}
bootstrap();
