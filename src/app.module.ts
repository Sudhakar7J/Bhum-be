import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { FileModule } from "./file/file.module"
import { TypeOrmModule } from "@nestjs/typeorm"

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "postgres",
      host: "postgres.cctzg6zjlm2h.ap-south-1.rds.amazonaws.com",
      username: "postgres",
      password: "admin",
      database: "postgres",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
      extra: {
        trustServerCertificate: true,
        Encrypt: true,
        IntegratedSecurity: false,
      },
    }),
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
