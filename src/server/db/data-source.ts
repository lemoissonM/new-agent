import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { Lesson } from './entities/Lesson.js';
import { LessonStep } from './entities/LessonStep.js';
import { AgentConversation } from './entities/AgentConversation.js';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [Lesson, LessonStep, AgentConversation],
  migrations: ['src/server/db/migrations/*.ts'],
  subscribers: [],
});