-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Lessons table
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    classe VARCHAR(50) NOT NULL,
    domain VARCHAR(100),
    area_of_life VARCHAR(100),
    previous_lesson TEXT,
    content_outline TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Lesson steps table
CREATE TABLE IF NOT EXISTS lesson_steps (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    step_name VARCHAR(100) NOT NULL,
    step_type VARCHAR(50) NOT NULL,
    content TEXT,
    user_feedback TEXT,
    approved BOOLEAN DEFAULT FALSE,
    agent_metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Agent conversations table
CREATE TABLE IF NOT EXISTS agent_conversations (
    id SERIAL PRIMARY KEY,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    step_id INTEGER REFERENCES lesson_steps(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    embedding vector(1536),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lessons_status ON lessons(status);
CREATE INDEX IF NOT EXISTS idx_lesson_steps_lesson_id ON lesson_steps(lesson_id);
CREATE INDEX IF NOT EXISTS idx_agent_conversations_lesson_id ON agent_conversations(lesson_id);
CREATE INDEX IF NOT EXISTS idx_agent_conversations_step_id ON agent_conversations(step_id);

-- Vector similarity search index
CREATE INDEX IF NOT EXISTS idx_agent_conversations_embedding ON agent_conversations USING ivfflat (embedding vector_cosine_ops);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_steps_updated_at BEFORE UPDATE ON lesson_steps
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();