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
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useStaticAssets(resolve(__dirname, '.', 'uploads'), {
    prefix: '/uploads/',
  });

  app.enableCors({
    origin: [
      "https://frontend-mdy5.onrender.com",
      "http://localhost:5173",
      "https://backend-hx6c.onrender.com",
    ],
    credentials: true,
  });

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("Nest API")
    .setDescription("The Nest API description")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  const server = app.getHttpServer();
  server.setTimeout(20 * 60 * 1000); // 10 mins

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
