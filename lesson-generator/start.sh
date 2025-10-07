#!/bin/bash

# AI Lesson Generator - Quick Start Script

echo "🚀 Starting AI Lesson Generator..."
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://www.docker.com/get-started"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists in backend
if [ ! -f backend/.env ]; then
    echo "⚙️  Setting up environment file..."
    cp backend/.env.example backend/.env
    echo ""
    echo "⚠️  IMPORTANT: Please edit backend/.env and add your OpenAI API key!"
    echo "   Open backend/.env in a text editor and set:"
    echo "   OPENAI_API_KEY=your_actual_api_key_here"
    echo ""
    read -p "Press Enter after you've added your API key..."
fi

# Start Docker containers
echo "🐳 Starting Docker containers..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if backend is ready
echo "🔍 Checking backend health..."
until curl -f http://localhost:3000/api/health &> /dev/null || [ $((++attempts)) -eq 30 ]; do
    printf '.'
    sleep 2
done
echo ""

if [ $attempts -eq 30 ]; then
    echo "❌ Backend failed to start. Check logs with: docker-compose logs backend"
    exit 1
fi

echo "✅ Backend is ready!"

# Run migrations
echo "📊 Running database migrations..."
docker-compose exec -T backend npm run migration:run

echo ""
echo "✅ Setup complete!"
echo ""
echo "📚 Access the application at: http://localhost:5173"
echo "🔧 Backend API available at: http://localhost:3000"
echo ""
echo "📖 View logs: docker-compose logs -f"
echo "🛑 Stop services: docker-compose down"
echo ""
echo "Happy teaching! 🎓"