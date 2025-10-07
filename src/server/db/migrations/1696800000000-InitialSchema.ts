import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1696800000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable pgvector extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector`);

    // Create lessons table
    await queryRunner.query(`
      CREATE TABLE "lessons" (
        "id" SERIAL PRIMARY KEY,
        "title" VARCHAR(255) NOT NULL,
        "subject" VARCHAR(100) NOT NULL,
        "classe" VARCHAR(50) NOT NULL,
        "domain" VARCHAR(100),
        "area_of_life" VARCHAR(100),
        "previous_lesson" TEXT,
        "content_outline" TEXT,
        "status" VARCHAR(50) DEFAULT 'draft',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Create lesson_steps table
    await queryRunner.query(`
      CREATE TABLE "lesson_steps" (
        "id" SERIAL PRIMARY KEY,
        "lesson_id" INTEGER NOT NULL,
        "step_name" VARCHAR(100) NOT NULL,
        "step_type" VARCHAR(50) NOT NULL,
        "content" TEXT,
        "user_feedback" TEXT,
        "approved" BOOLEAN DEFAULT FALSE,
        "agent_metadata" JSONB,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "fk_lesson_steps_lesson" FOREIGN KEY ("lesson_id") 
          REFERENCES "lessons"("id") ON DELETE CASCADE
      )
    `);

    // Create agent_conversations table
    await queryRunner.query(`
      CREATE TABLE "agent_conversations" (
        "id" SERIAL PRIMARY KEY,
        "lesson_id" INTEGER NOT NULL,
        "step_id" INTEGER,
        "role" VARCHAR(50) NOT NULL,
        "content" TEXT NOT NULL,
        "embedding" vector(1536),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "fk_agent_conversations_lesson" FOREIGN KEY ("lesson_id") 
          REFERENCES "lessons"("id") ON DELETE CASCADE,
        CONSTRAINT "fk_agent_conversations_step" FOREIGN KEY ("step_id") 
          REFERENCES "lesson_steps"("id") ON DELETE CASCADE
      )
    `);

    // Create indexes
    await queryRunner.query(`CREATE INDEX "idx_lessons_status" ON "lessons"("status")`);
    await queryRunner.query(`CREATE INDEX "idx_lesson_steps_lesson_id" ON "lesson_steps"("lesson_id")`);
    await queryRunner.query(`CREATE INDEX "idx_agent_conversations_lesson_id" ON "agent_conversations"("lesson_id")`);
    await queryRunner.query(`CREATE INDEX "idx_agent_conversations_step_id" ON "agent_conversations"("step_id")`);
    
    // Create vector similarity search index
    await queryRunner.query(`
      CREATE INDEX "idx_agent_conversations_embedding" 
      ON "agent_conversations" USING ivfflat ("embedding" vector_cosine_ops)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_agent_conversations_embedding"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_agent_conversations_step_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_agent_conversations_lesson_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_lesson_steps_lesson_id"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_lessons_status"`);
    await queryRunner.query(`DROP TABLE "agent_conversations"`);
    await queryRunner.query(`DROP TABLE "lesson_steps"`);
    await queryRunner.query(`DROP TABLE "lessons"`);
  }
}