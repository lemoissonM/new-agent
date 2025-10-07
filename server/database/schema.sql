-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Fiches table
CREATE TABLE IF NOT EXISTS fiches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject VARCHAR(255) NOT NULL,
  lesson_title VARCHAR(255) NOT NULL,
  area_of_life VARCHAR(255) NOT NULL,
  classe VARCHAR(50) NOT NULL,
  domain VARCHAR(255),
  content_outline TEXT,
  previous_lesson VARCHAR(255),
  
  -- Generated content
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
  resume_teacher TEXT,
  resume_student TEXT,
  activite_controle_application_teacher TEXT,
  activite_controle_application_student TEXT,
  activite_controle_research_teacher TEXT,
  activite_controle_research_student TEXT,
  activite_controle_evaluation_teacher TEXT,
  activite_controle_evaluation_student TEXT,
  
  -- Metadata
  status VARCHAR(50) DEFAULT 'draft',
  current_step VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Step history table
CREATE TABLE IF NOT EXISTS step_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fiche_id UUID REFERENCES fiches(id) ON DELETE CASCADE,
  step_name VARCHAR(100) NOT NULL,
  user_input TEXT,
  agent_output TEXT,
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Embeddings for semantic search
CREATE TABLE IF NOT EXISTS lesson_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fiche_id UUID REFERENCES fiches(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS lesson_embeddings_vector_idx 
  ON lesson_embeddings USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_fiches_updated_at 
  BEFORE UPDATE ON fiches 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();