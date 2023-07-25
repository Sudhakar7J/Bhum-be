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
      port: 5432,
      username: "postgres",
      password: "adminadmin",
      database: "postgres",
      entities: [__dirname + "/**/*.entity{.ts,.js}"],
      synchronize: true,
       ssl: {
        rejectUnauthorized: false, // Set to true if your RDS instance has a valid SSL certificate
      },
      autoLoadEntities: true,
    }),
    FileModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

