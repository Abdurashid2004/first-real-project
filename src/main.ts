import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ConfigService } from "@nestjs/config";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { ValidationPipe } from "@nestjs/common";

async function Start() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  console.log(config.get<number>("PORT"));
  app.enableCors({
    origin: "*", // Barcha domenlarga ruxsat berish
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Ruxsat berilgan metodlar
    allowedHeaders: "Content-Type, Accept", // Ruxsat berilgan headerlar
    credentials: true, // Cookie-larni yuborishga ruxsat berish
  });

  app.use(cookieParser());

  const PORT = config.get<number>("PORT") || 3030;

  app.useGlobalPipes(new ValidationPipe());
  app.setGlobalPrefix("api");
  const options = new DocumentBuilder()
    .setTitle("Taxi Uzbekistan")
    .setDescription("API description")
    .setVersion("1.0")
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup("api/docs", app, document);

  await app.listen(PORT);
  console.log(`Server is running on http://localhost:${PORT}`);
}
Start();
