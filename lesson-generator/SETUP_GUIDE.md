# Setup Guide - AI Lesson Generator

This guide will help you set up the AI Lesson Generator from scratch.

## Prerequisites

### Required Software
1. **Node.js** (v20 or higher)
   - Download from https://nodejs.org/
   - Verify: `node --version`

2. **Docker & Docker Compose**
   - Download Docker Desktop from https://www.docker.com/
   - Verify: `docker --version` and `docker-compose --version`

3. **OpenAI API Key**
   - Sign up at https://platform.openai.com/
   - Create an API key from your dashboard

### Optional (for manual setup without Docker)
4. **PostgreSQL 16+** with pgVector extension
5. **Redis 7+**

## Installation Steps

### Option 1: Docker Setup (Recommended)

#### Step 1: Clone and Navigate
\`\`\`bash
cd lesson-generator
\`\`\`

#### Step 2: Configure Environment
\`\`\`bash
# Copy example environment file
cp backend/.env.example backend/.env

# Edit the file and add your OpenAI API key
# On Mac/Linux:
nano backend/.env

# On Windows:
notepad backend/.env
\`\`\`

Add your OpenAI API key:
\`\`\`env
OPENAI_API_KEY=sk-your-actual-api-key-here
\`\`\`

#### Step 3: Start All Services
\`\`\`bash
# Start all containers
docker-compose up -d

# Check status
docker-compose ps
\`\`\`

You should see 4 services running:
- postgres (port 5432)
- redis (port 6379)
- backend (port 3000)
- frontend (port 5173)

#### Step 4: Run Database Migrations
\`\`\`bash
# Enter backend container
docker-compose exec backend sh

# Run migrations
npm run migration:run

# Exit container
exit
\`\`\`

#### Step 5: Access the Application
Open your browser and go to: http://localhost:5173

### Option 2: Manual Setup

#### Step 1: Install PostgreSQL with pgVector

**On Mac (using Homebrew):**
\`\`\`bash
brew install postgresql@16
brew install pgvector

# Start PostgreSQL
brew services start postgresql@16

# Create database
createdb lesson_generator
\`\`\`

**On Ubuntu/Debian:**
\`\`\`bash
sudo apt-get update
sudo apt-get install postgresql-16 postgresql-contrib-16

# Install pgvector
git clone https://github.com/pgvector/pgvector.git
cd pgvector
make
sudo make install
\`\`\`

**On Windows:**
- Download PostgreSQL from https://www.postgresql.org/download/windows/
- Install pgvector manually from https://github.com/pgvector/pgvector

#### Step 2: Install Redis

**On Mac:**
\`\`\`bash
brew install redis
brew services start redis
\`\`\`

**On Ubuntu/Debian:**
\`\`\`bash
sudo apt-get install redis-server
sudo systemctl start redis
\`\`\`

**On Windows:**
- Download from https://github.com/microsoftarchive/redis/releases

#### Step 3: Setup Backend
\`\`\`bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your OpenAI API key

# Run migrations
npm run migration:run

# Start development server
npm run start:dev
\`\`\`

Backend should now be running on http://localhost:3000

#### Step 4: Setup Frontend
\`\`\`bash
cd ../frontend

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

Frontend should now be running on http://localhost:5173

## Verification

### Test Backend
\`\`\`bash
curl http://localhost:3000/api/health
\`\`\`

### Test Frontend
Open http://localhost:5173 in your browser

### Test Database Connection
\`\`\`bash
cd backend
npm run typeorm -- query "SELECT version()"
\`\`\`

## Troubleshooting

### Port Already in Use
If ports 3000, 5173, 5432, or 6379 are already in use:

**Option 1:** Stop the conflicting service
**Option 2:** Change ports in docker-compose.yml or .env files

### Database Connection Errors
\`\`\`bash
# Check PostgreSQL is running
docker-compose ps postgres
# or
pg_isready

# Check logs
docker-compose logs postgres
\`\`\`

### Redis Connection Errors
\`\`\`bash
# Check Redis is running
docker-compose ps redis
# or
redis-cli ping

# Check logs
docker-compose logs redis
\`\`\`

### OpenAI API Errors
- Verify your API key is correct in backend/.env
- Check you have credits in your OpenAI account
- Ensure there are no extra spaces in the .env file

### Frontend Can't Connect to Backend
- Ensure backend is running on port 3000
- Check CORS settings in backend/src/main.ts
- Verify proxy settings in frontend/vite.config.ts

## Database Management

### Create a New Migration
\`\`\`bash
cd backend
npm run migration:generate -- -n MigrationName
\`\`\`

### Revert Last Migration
\`\`\`bash
npm run migration:revert
\`\`\`

### Reset Database (CAUTION: Deletes all data)
\`\`\`bash
# Drop and recreate database
docker-compose down -v
docker-compose up -d
npm run migration:run
\`\`\`

## Production Deployment

### Build for Production
\`\`\`bash
# Backend
cd backend
npm run build

# Frontend
cd ../frontend
npm run build
\`\`\`

### Environment Variables for Production
Update these in production:
- `NODE_ENV=production`
- `DATABASE_HOST=<your-prod-db-host>`
- `FRONTEND_URL=<your-frontend-url>`
- Strong passwords for database
- SSL certificates

### Deploy with Docker
\`\`\`bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Start services
docker-compose -f docker-compose.prod.yml up -d
\`\`\`

## Updating the Application

\`\`\`bash
# Pull latest changes
git pull

# Update backend
cd backend
npm install
npm run migration:run
docker-compose restart backend

# Update frontend
cd ../frontend
npm install
docker-compose restart frontend
\`\`\`

## Need Help?

- Check the main README.md for usage instructions
- Review the API documentation
- Open an issue on GitHub
- Check Docker logs: `docker-compose logs <service-name>`

---

**You're all set! Start creating amazing lesson plans! 🎉**