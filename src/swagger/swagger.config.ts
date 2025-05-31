import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { INestApplication } from '@nestjs/common';

export function initializeSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Keeplet')
    .setDescription('The Keeplet API description')
    .setVersion('1.0')
    .addTag('keeplet')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
