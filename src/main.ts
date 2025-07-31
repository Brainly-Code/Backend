/* eslint-disable prettier/prettier */

import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { resolve } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useStaticAssets(resolve(__dirname, '.', 'uploads'), {
    prefix: '/uploads/',
  });

  app.enableCors({
    origin: ['http://localhost:5173', 'http://192.168.56.1:5173', 'https://frontend-mdy5.onrender.com', "https://frontend-mdy5.onrender.com/"],
    credentials: true,
  });

  console.log('Static path:', resolve(__dirname, '..', 'uploads'));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("Nest API")
    .setDescription("The Nest API description")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  // ✅ Increase HTTP server timeout to 10 minutes
  const server = app.getHttpServer();
  server.setTimeout(10 * 60 * 1000); // 10 mins


  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
