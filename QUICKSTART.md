# Quick Start Guide

Get up and running in 5 minutes!

## Prerequisites Check

```bash
# Check Node.js (need 18+)
node --version

# Check PostgreSQL (need 14+)
psql --version

# Check if you have an OpenAI API key
# Get one at: https://platform.openai.com/api-keys
```

## Installation (3 Steps)

### 1️⃣ Install Dependencies

```bash
npm install
```

### 2️⃣ Set Up Database (Choose one)

**Option A: Using Docker (Recommended)**
```bash
docker-compose up -d
```

**Option B: Local PostgreSQL**
```bash
createdb lesson_generator
psql lesson_generator < server/database/schema.sql
```

### 3️⃣ Configure Environment

```bash
# Copy example file
cp .env.example .env

# Edit .env and add your OpenAI API key
# OPENAI_API_KEY=sk-your-key-here
```

## Run the App

```bash
npm run dev:all
```

Open http://localhost:5173 🎉

## Usage Flow

1. **Create a Lesson**
   - Click "Create New Lesson"
   - Fill in: Subject, Title, Class, Area of Life
   - Click "Create Lesson"

2. **Generate Steps**
   - Click "Generate Content" for each step
   - Review the AI-generated content
   - Approve or request changes

3. **Complete & Export**
   - Progress through all steps
   - Download/print when complete

## Common Commands

```bash
# Start both frontend and backend
npm run dev:all

# Start frontend only
npm run dev

# Start backend only
npm run server

# Build for production
npm run build

# View database
psql lesson_generator
```

## Troubleshooting

**Can't connect to database?**
```bash
# Start PostgreSQL
sudo systemctl start postgresql  # Linux
brew services start postgresql@14  # macOS
```

**Port already in use?**
- Change `PORT=3002` in `.env`

**API key not working?**
- Check for spaces in `.env`
- Verify at https://platform.openai.com/api-keys
- Ensure billing is enabled

## Need More Help?

- Full docs: [README.md](README.md)
- Detailed setup: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Issues: Create a GitHub issue

---

**Pro Tip:** Use Docker for the easiest setup - it handles PostgreSQL + pgVector automatically!