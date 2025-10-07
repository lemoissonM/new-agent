#!/bin/bash

# AI Lesson Generator - Quick Start Script

echo "🎓 AI Lesson Generator - Quick Start"
echo "===================================="
echo ""

# Check if .env exists
if [ ! -f "backend/.env" ]; then
    echo "⚠️  No .env file found. Creating from example..."
    cp backend/.env.example backend/.env
    echo "✅ Created backend/.env"
    echo "⚠️  Please edit backend/.env and add your OPENAI_API_KEY"
    echo ""
    read -p "Press Enter to continue after setting your API key..."
fi

# Check if Docker is installed
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "🐳 Docker detected. Would you like to use Docker? (recommended)"
    read -p "Use Docker? (y/n): " use_docker
    
    if [ "$use_docker" = "y" ] || [ "$use_docker" = "Y" ]; then
        echo ""
        echo "Starting with Docker Compose..."
        docker-compose up
        exit 0
    fi
fi

# Manual setup
echo ""
echo "📦 Installing dependencies..."
echo ""

# Backend
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Frontend
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Installation complete!"
echo ""
echo "To start the application:"
echo "1. Start backend:  cd backend && npm run dev"
echo "2. Start frontend: cd frontend && npm run dev"
echo "3. Open browser:   http://localhost:5173"
echo ""
echo "📚 See SETUP.md for detailed instructions"