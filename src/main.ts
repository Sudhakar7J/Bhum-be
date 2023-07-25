import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import * as express from "express"
import { FilledPDF } from "./file/file.entity"

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  await app.listen(4000)
}
bootstrap()
