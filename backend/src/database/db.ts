import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/lesson_generator',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function query(text: string, params?: any[]) {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Executed query', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export async function getClient(): Promise<PoolClient> {
  return await pool.connect();
}

export async function initDatabase() {
  const client = await getClient();
  try {
    // Enable pgvector extension
    await client.query('CREATE EXTENSION IF NOT EXISTS vector');

    // Create fiches table
    await client.query(`
      CREATE TABLE IF NOT EXISTS fiches (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        subject VARCHAR(255) NOT NULL,
        lesson_title VARCHAR(500) NOT NULL,
        area_of_life VARCHAR(255),
        classe VARCHAR(50) NOT NULL,
        domain VARCHAR(255),
        content_outline TEXT,
        previous_lesson VARCHAR(500),
        objectives TEXT,
        revision_teacher TEXT,
        revision_student TEXT,
        revision_teacher_rappel TEXT,
        revision_student_rappel TEXT,
        revision_teacher_motivation TEXT,
        revision_student_motivation TEXT,
        situation TEXT,
        activite_principale_teacher TEXT,
        activite_principale_student TEXT,
        synthese_teacher TEXT,
        synthese_student TEXT,
        exercice TEXT,
        situation_similaire TEXT,
        activite_controle_application_teacher TEXT,
        activite_controle_application_student TEXT,
        activite_controle_research_teacher TEXT,
        activite_controle_research_student TEXT,
        activite_controle_evaluation_teacher TEXT,
        activite_controle_evaluation_student TEXT,
        current_step INTEGER DEFAULT 0,
        status VARCHAR(50) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create lesson_sessions table
    await client.query(`
      CREATE TABLE IF NOT EXISTS lesson_sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        fiche_id UUID REFERENCES fiches(id) ON DELETE CASCADE,
        current_step_index INTEGER DEFAULT 0,
        completed_steps TEXT[] DEFAULT '{}',
        pending_approval BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create lesson_embeddings table for vector search
    await client.query(`
      CREATE TABLE IF NOT EXISTS lesson_embeddings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        fiche_id UUID REFERENCES fiches(id) ON DELETE CASCADE,
        step_name VARCHAR(100),
        content TEXT,
        embedding vector(1536),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index for vector similarity search
    await client.query(`
      CREATE INDEX IF NOT EXISTS lesson_embeddings_vector_idx 
      ON lesson_embeddings 
      USING ivfflat (embedding vector_cosine_ops)
      WITH (lists = 100)
    `);

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
  }
}

export default pool;