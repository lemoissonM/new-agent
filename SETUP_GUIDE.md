# Setup Guide - Lesson Generator

This guide will help you set up the AI-Powered Lesson Generator application.

## Quick Start (Recommended)

### Option 1: Using Docker (Easiest)

1. **Install Docker Desktop**
   - Download from https://www.docker.com/products/docker-desktop

2. **Start PostgreSQL with pgVector**
   ```bash
   docker-compose up -d
   ```

3. **Install Node dependencies**
   ```bash
   npm install
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your OpenAI API key:
   ```env
   OPENAI_API_KEY=sk-...your-key...
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/lesson_generator
   PORT=3001
   ```

5. **Start the application**
   ```bash
   npm run dev:all
   ```

6. **Open your browser**
   - http://localhost:5173

### Option 2: Manual Setup

1. **Install PostgreSQL 14+**
   
   **On Ubuntu/Debian:**
   ```bash
   sudo apt-get update
   sudo apt-get install postgresql-14 postgresql-contrib
   ```
   
   **On macOS:**
   ```bash
   brew install postgresql@14
   brew services start postgresql@14
   ```
   
   **On Windows:**
   - Download from https://www.postgresql.org/download/windows/

2. **Install pgVector extension**
   
   **On Ubuntu/Debian:**
   ```bash
   sudo apt-get install postgresql-14-pgvector
   ```
   
   **On macOS:**
   ```bash
   brew install pgvector
   ```
   
   **On Windows:**
   - Follow instructions at https://github.com/pgvector/pgvector#windows

3. **Create database**
   ```bash
   createdb lesson_generator
   ```

4. **Run setup script**
   ```bash
   chmod +x setup.sh
   ./setup.sh
   ```

5. **Add your OpenAI API key**
   
   Edit `.env` and add:
   ```env
   OPENAI_API_KEY=sk-...your-key...
   ```

6. **Start the application**
   ```bash
   npm run dev:all
   ```

## Getting an OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new secret key
5. Copy the key and add it to your `.env` file

**Note:** You'll need billing enabled on your OpenAI account. The app uses GPT-4 which requires a paid account.

## Troubleshooting

### PostgreSQL Connection Issues

**Error: "Connection refused"**
- Make sure PostgreSQL is running:
  ```bash
  # On Linux/macOS
  sudo systemctl status postgresql
  # or
  brew services list
  
  # On Windows (in Services)
  services.msc
  ```

**Error: "Database does not exist"**
- Create the database:
  ```bash
  createdb lesson_generator
  psql lesson_generator < server/database/schema.sql
  ```

### pgVector Extension Issues

**Error: "Extension vector does not exist"**
- Install pgVector extension (see installation steps above)
- Verify installation:
  ```bash
  psql lesson_generator -c "CREATE EXTENSION IF NOT EXISTS vector;"
  ```

### Node.js Issues

**Error: "Cannot find module"**
- Delete node_modules and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

**Port already in use**
- Change the port in `.env`:
  ```env
  PORT=3002  # or any other available port
  ```

### OpenAI API Issues

**Error: "Incorrect API key"**
- Verify your API key in `.env`
- Make sure there are no extra spaces or quotes
- Check your OpenAI account has billing enabled

**Error: "Rate limit exceeded"**
- You've hit OpenAI's rate limits
- Wait a few minutes before trying again
- Consider upgrading your OpenAI plan

## Development Tips

### Running in Development Mode

**Frontend only (with auto-reload):**
```bash
npm run dev
```

**Backend only (with auto-reload):**
```bash
npm run server
```

**Both together:**
```bash
npm run dev:all
```

### Viewing Database Content

```bash
# Connect to database
psql lesson_generator

# List all tables
\dt

# View fiches
SELECT id, lesson_title, subject, status FROM fiches;

# View step history
SELECT fiche_id, step_name, approved FROM step_history;

# Exit
\q
```

### Resetting the Database

```bash
psql lesson_generator < server/database/schema.sql
```

This will recreate all tables (WARNING: deletes existing data).

### Building for Production

```bash
# Build frontend and backend
npm run build

# Preview production build
npm run preview
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `OPENAI_API_KEY` | Your OpenAI API key | `sk-...` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/lesson_generator` |
| `PORT` | Backend server port | `3001` |
| `PGVECTOR_EXTENSION` | Enable pgVector (optional) | `true` |

## Next Steps

Once everything is running:

1. **Create your first lesson**
   - Click "Create New Lesson"
   - Fill in the lesson details
   - Choose your class level

2. **Generate lesson steps**
   - Click "Generate Content" for each step
   - Review and approve or request changes
   - Provide feedback to refine the content

3. **Explore features**
   - Try different subjects and class levels
   - Experiment with feedback to improve outputs
   - Save multiple lessons

## Support

If you encounter issues not covered here:

1. Check the main [README.md](README.md)
2. Review error messages in the browser console (F12)
3. Check server logs in the terminal
4. Create an issue on GitHub

## Security Notes

- Never commit your `.env` file
- Keep your OpenAI API key private
- Use strong database passwords in production
- Enable SSL/TLS for production databases

---

Happy teaching! If you have questions, don't hesitate to ask for help. 🎓