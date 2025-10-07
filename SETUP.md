# Setup Guide

## Quick Start with Docker (Recommended)

The easiest way to get started is using Docker Compose:

1. **Prerequisites**
   - Docker and Docker Compose installed
   - OpenAI API key

2. **Setup**
```bash
# Create .env file in the root directory
echo "OPENAI_API_KEY=your_api_key_here" > .env

# Start all services
docker-compose up
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- PostgreSQL: localhost:5432

## Manual Setup

### 1. PostgreSQL with pgVector

**Option A: Using Docker**
```bash
docker run -d \
  --name lesson-postgres \
  -e POSTGRES_USER=lesson_user \
  -e POSTGRES_PASSWORD=lesson_password \
  -e POSTGRES_DB=lesson_generator \
  -p 5432:5432 \
  ankane/pgvector:latest
```

**Option B: Manual Installation**
```bash
# Install PostgreSQL 14+
sudo apt-get install postgresql-14

# Install pgVector extension
cd /tmp
git clone https://github.com/pgvector/pgvector.git
cd pgvector
make
sudo make install

# Create database
sudo -u postgres psql
CREATE DATABASE lesson_generator;
CREATE USER lesson_user WITH PASSWORD 'lesson_password';
GRANT ALL PRIVILEGES ON DATABASE lesson_generator TO lesson_user;
\q
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=3000
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=postgresql://lesson_user:lesson_password@localhost:5432/lesson_generator
PGVECTOR_ENABLED=true
CORS_ORIGIN=http://localhost:5173
EOF

# Run migrations (automatic on first start)
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

## Production Build

### Backend
```bash
cd backend
npm run build
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview
```

## Environment Variables

### Backend (.env)
```env
PORT=3000                          # Server port
OPENAI_API_KEY=sk-...             # Your OpenAI API key (required)
DATABASE_URL=postgresql://...      # PostgreSQL connection string
PGVECTOR_ENABLED=true             # Enable vector embeddings
CORS_ORIGIN=http://localhost:5173 # Frontend URL for CORS
```

## Database Initialization

The application automatically:
1. Creates the `vector` extension
2. Creates all required tables
3. Sets up indexes for pgVector

Tables created:
- `fiches` - Lesson plans
- `lesson_sessions` - Generation sessions
- `lesson_embeddings` - Vector embeddings (1536 dimensions)

## Testing the API

```bash
# Health check
curl http://localhost:3000/health

# Create a lesson
curl -X POST http://localhost:3000/api/fiches \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Mathematics",
    "lessonTitle": "Introduction to Fractions",
    "classe": "10",
    "areaOfLife": "Finance",
    "previousLesson": "Basic Operations"
  }'
```

## Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -h localhost -U lesson_user -d lesson_generator
```

### pgVector Extension Issues
```sql
-- Check if extension is installed
SELECT * FROM pg_extension WHERE extname = 'vector';

-- If not, install it
CREATE EXTENSION vector;
```

### OpenAI API Issues
- Verify API key is valid
- Check rate limits
- Ensure you have GPT-4 access

### Port Conflicts
If ports 3000 or 5173 are already in use:
```bash
# Backend: Change PORT in backend/.env
PORT=3001

# Frontend: Change port in frontend/vite.config.ts
server: { port: 5174 }
```

## Performance Optimization

### Database
```sql
-- Monitor query performance
EXPLAIN ANALYZE SELECT * FROM fiches WHERE id = 'uuid';

-- Add indexes if needed
CREATE INDEX idx_fiches_status ON fiches(status);
CREATE INDEX idx_fiches_classe ON fiches(classe);
```

### Frontend
```bash
# Analyze bundle size
cd frontend
npm run build
npx vite-bundle-visualizer
```

## Security Considerations

1. **Never commit .env files** - Contains sensitive API keys
2. **Use strong database passwords** in production
3. **Enable HTTPS** for production deployments
4. **Restrict CORS origins** to your actual frontend domain
5. **Implement rate limiting** for API endpoints
6. **Validate all user inputs** on backend

## Deployment

### Backend (Node.js)
- Deploy to: Heroku, Railway, Render, AWS, DigitalOcean
- Ensure PostgreSQL with pgVector support
- Set environment variables in platform

### Frontend (Static)
- Deploy to: Vercel, Netlify, Cloudflare Pages
- Build command: `npm run build`
- Output directory: `dist`

### Database
- Use managed PostgreSQL services:
  - Supabase (has pgVector support)
  - Neon
  - AWS RDS with pgVector extension

## Support

For issues or questions:
1. Check the main README.md
2. Review error logs in console
3. Open an issue on GitHub