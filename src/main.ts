import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { loggingMiddleware } from './middlewares/logging.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // app.use(new loggingMiddleware());

  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
