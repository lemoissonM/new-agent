import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatKitModule } from './chatkit/chatkit.module';
import { LessonModule } from './lesson/lesson.module';
import { AppDataSource } from './database/data-source';
import { ChatKitController } from './chatkit/controllers/chatkit.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot(AppDataSource.options),
    ChatKitModule,
    LessonModule,
  ],
  controllers: [ChatKitController],
})
export class AppModule {}