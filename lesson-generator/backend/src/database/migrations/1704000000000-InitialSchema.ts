import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1704000000000 implements MigrationInterface {
  name = 'InitialSchema1704000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Enable pgvector extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS vector`);

    // Create threads table
    await queryRunner.query(`
      CREATE TABLE "threads" (
        "id" character varying NOT NULL,
        "title" character varying,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "status" jsonb NOT NULL DEFAULT '{"type":"active"}',
        "metadata" jsonb NOT NULL DEFAULT '{}',
        CONSTRAINT "PK_threads" PRIMARY KEY ("id")
      )
    `);

    // Create thread_items table
    await queryRunner.query(`
      CREATE TABLE "thread_items" (
        "id" character varying NOT NULL,
        "thread_id" character varying NOT NULL,
        "type" character varying NOT NULL,
        "data" jsonb NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_thread_items" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_thread_items_thread_created" ON "thread_items" ("thread_id", "created_at")
    `);

    await queryRunner.query(`
      ALTER TABLE "thread_items"
      ADD CONSTRAINT "FK_thread_items_thread"
      FOREIGN KEY ("thread_id") REFERENCES "threads"("id") ON DELETE CASCADE
    `);

    // Create attachments table
    await queryRunner.query(`
      CREATE TABLE "attachments" (
        "id" character varying NOT NULL,
        "name" character varying NOT NULL,
        "mime_type" character varying NOT NULL,
        "type" character varying NOT NULL,
        "upload_url" character varying,
        "preview_url" character varying,
        "size" bigint NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_attachments" PRIMARY KEY ("id")
      )
    `);

    // Create lessons table
    await queryRunner.query(`
      CREATE TABLE "lessons" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "thread_id" character varying NOT NULL,
        "subject" character varying NOT NULL,
        "lesson_title" character varying NOT NULL,
        "classe" character varying NOT NULL,
        "domain" character varying,
        "area_of_life" character varying,
        "previous_lesson" character varying,
        "content_outline" character varying,
        "level" character varying NOT NULL DEFAULT 'maternelle',
        "step_data" jsonb NOT NULL DEFAULT '{}',
        "current_step" character varying NOT NULL DEFAULT 'objectives',
        "status" character varying NOT NULL DEFAULT 'in_progress',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_lessons" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_lessons_thread_id" UNIQUE ("thread_id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_lessons_thread_id" ON "lessons" ("thread_id")
    `);

    // Create lesson_steps table
    await queryRunner.query(`
      CREATE TABLE "lesson_steps" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "lesson_id" character varying NOT NULL,
        "step_slug" character varying NOT NULL,
        "step_title" character varying NOT NULL,
        "step_type" character varying NOT NULL,
        "content" text,
        "status" character varying NOT NULL DEFAULT 'pending',
        "user_feedback" jsonb,
        "order" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_lesson_steps" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_lesson_steps_lesson_step" ON "lesson_steps" ("lesson_id", "step_slug")
    `);

    await queryRunner.query(`
      ALTER TABLE "lesson_steps"
      ADD CONSTRAINT "FK_lesson_steps_lesson"
      FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "lesson_steps"`);
    await queryRunner.query(`DROP TABLE "lessons"`);
    await queryRunner.query(`DROP TABLE "attachments"`);
    await queryRunner.query(`DROP TABLE "thread_items"`);
    await queryRunner.query(`DROP TABLE "threads"`);
    await queryRunner.query(`DROP EXTENSION IF EXISTS vector`);
  }
}