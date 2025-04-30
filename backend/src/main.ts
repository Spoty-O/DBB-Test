import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import checkEnv from './env';
import * as bodyParser from 'body-parser';

async function bootstrap(): Promise<void> {
  checkEnv();

  const app = await NestFactory.create(AppModule);

  app.enableShutdownHooks();

  const config = new DocumentBuilder()
    .setTitle('DBB Test Task')
    .setDescription('API documentation for DBB Test Task')
    .setVersion('1.0')
    .addServer(process.env.OWN_URL, 'Local server')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.use(bodyParser.json({ limit: '4gb' }));
  app.use(bodyParser.urlencoded({ limit: '4gb', extended: true }));

  await app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on ${process.env.PORT || 8080}`);
  });
}

bootstrap();