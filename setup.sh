#!/bin/bash

echo "🚀 Setting up Lesson Generator..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL 14+ first."
    exit 1
fi

echo "✅ Node.js and PostgreSQL detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please edit .env and add your OPENAI_API_KEY and DATABASE_URL"
else
    echo "✅ .env file already exists"
fi

# Check if database exists
DB_NAME="lesson_generator"
if psql -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "✅ Database '$DB_NAME' already exists"
else
    echo "📊 Creating database '$DB_NAME'..."
    createdb $DB_NAME
    echo "✅ Database created"
fi

# Run schema
echo "🗄️  Setting up database schema..."
psql $DB_NAME < server/database/schema.sql

echo "
✅ Setup complete!

Next steps:
1. Edit .env and add your OPENAI_API_KEY
2. Update DATABASE_URL in .env if needed
3. Run 'npm run dev:all' to start the application

The app will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

Happy teaching! 🎓
"