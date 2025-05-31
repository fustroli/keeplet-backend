import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { appConfig } from 'src/config';
import helmet from 'helmet';
import { json } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = appConfig.PORT;

  //secure app by setting HTTP response headers
  app.use(helmet());

  app.use(cookieParser());

  //enable cors
  app.enableCors({ origin: appConfig.FRONTEND_URL, credentials: true });

  //validation pipeline
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.use(json({ limit: '20kb' }));

  await app.listen(port);
}
bootstrap();
