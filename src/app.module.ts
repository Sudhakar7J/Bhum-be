import { Module } from "@nestjs/common"
import { AppController } from "./app.controller"
import { AppService } from "./app.service"
import { FileModule } from "./file/file.module"
import { TypeOrmModule } from "@nestjs/typeorm"
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot(), // Loads environment variables from .env or system environment
    TypeOrmModule.forRoot({
      type: 'postgres', // Replace with your database type (e.g., mysql, postgres, etc.)
      host: process.env.DB_HOST || 'localhost', // Replace with your RDS endpoint
      port: parseInt(process.env.DB_PORT, 10) || 5432, // Replace with your database port
      username: process.env.DB_USERNAME || 'username', // Replace with your database username
      password: process.env.DB_PASSWORD || 'password', // Replace with your database password
      database: process.env.DB_NAME || 'dbname', // Replace with your database name
       ssl: {
        rejectUnauthorized: false, // Set to true if your RDS instance has a valid SSL certificate
      },
      autoLoadEntities: true,
      synchronize: true, // Note: Do not use synchronize in production, as it can cause data loss
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
