/* eslint-disable prettier/prettier */
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { resolve } from "path";
import { NestExpressApplication } from "@nestjs/platform-express";
import * as cookieParser from "cookie-parser";
import { SocketIoAdapter } from './socket.adapter';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;

async function setupApp() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.use(cookieParser());

  app.useStaticAssets(resolve(__dirname, '.', 'uploads'), {
    prefix: '/uploads/',
  });

  app.enableCors({
    origin: [
      "https://brainlycode.dpdns.org",
      "http://localhost:5173",
      "https://frontend-mdy5.onrender.com",
      "https://backend-hx6c.onrender.com",
    ],
    credentials: true,
  });

  // Apply the custom Socket.IO adapter
  app.useWebSocketAdapter(new SocketIoAdapter(app));

  // Swagger
  const config = new DocumentBuilder()
    .setTitle("Nest API")
    .setDescription("The Nest API description")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document);

  return app;
}

async function bootstrap() {
  console.log('Starting NestJS application...');
  const app = await setupApp();
  
  const server = app.getHttpServer();
  server.setTimeout(20 * 60 * 1000); 

  await app.listen(PORT);
  console.log(`Application is running on: ${await app.getUrl()}`);
}

// Only run the server automatically if we are NOT on Vercel
if (!process.env.VERCEL) {
  void bootstrap();
}

// Export a serverless handler for Vercel
let cachedServer: any;
export default async function (req: any, res: any) {
  if (!cachedServer) {
    const app = await setupApp();
    await app.init();
    cachedServer = app.getHttpAdapter().getInstance();
  }
  return cachedServer(req, res);
}
