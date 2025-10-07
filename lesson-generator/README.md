# AI Lesson Generator

A comprehensive full-stack application for generating educational lesson plans using AI, built with NestJS, React, and OpenAI's ChatKit.

## 🌟 Features

- **Step-by-Step Lesson Generation**: AI-powered lesson plan creation following educational standards for three levels:
  - **Maternelle** (Nursery, ages 2-5)
  - **Primaire** (Primary, ages 5-12)
  - **Secondaire** (Secondary, ages 10-18)

- **Interactive Workflow**: Each lesson step requires user approval before proceeding
  - Review generated content
  - Approve to continue
  - Reject and provide feedback
  - Regenerate with modifications

- **Multi-Step Lesson Plans**:
  - Objectives
  - Revision/Recall
  - Motivation
  - Situation/Use Cases
  - Main Activities (Teacher & Student perspectives)
  - Synthesis
  - Exercises
  - Evaluation
  - Research activities (for Primaire/Maternelle)

- **Real-Time Chat Interface**: Built with OpenAI ChatKit for smooth streaming responses
- **PostgreSQL + pgVector**: Persistent storage with vector capabilities for future enhancements
- **TypeORM Migrations**: Robust database schema management

## 🏗️ Architecture

### Backend (NestJS)
- **ChatKit Server**: Converted from Python to TypeScript with full type safety
- **Lesson Service**: Orchestrates AI agents for each lesson step
- **TypeORM Store**: PostgreSQL integration with pgVector support
- **OpenAI Integration**: GPT-4 powered content generation
- **BullMQ**: Job queue system for async processing

### Frontend (React + Vite)
- **ChatKit React**: Real-time chat interface
- **Modern UI**: Beautiful, responsive design
- **TypeScript**: Full type safety
- **Vite**: Fast development and build

## 📋 Prerequisites

- Node.js 20+
- Docker & Docker Compose
- OpenAI API key

## 🚀 Quick Start

### 1. Clone the repository

\`\`\`bash
cd lesson-generator
\`\`\`

### 2. Set up environment variables

\`\`\`bash
# Backend
cp backend/.env.example backend/.env

# Edit backend/.env and add your OpenAI API key:
# OPENAI_API_KEY=your_key_here
\`\`\`

### 3. Start with Docker Compose

\`\`\`bash
docker-compose up -d
\`\`\`

This will start:
- PostgreSQL with pgVector (port 5432)
- Redis (port 6379)
- Backend API (port 3000)
- Frontend (port 5173)

### 4. Run database migrations

\`\`\`bash
cd backend
npm run migration:run
\`\`\`

### 5. Access the application

Open http://localhost:5173 in your browser

## 💻 Development Setup (without Docker)

### Backend

\`\`\`bash
cd backend

# Install dependencies
npm install

# Set up database (requires PostgreSQL with pgvector)
npm run migration:run

# Start development server
npm run start:dev
\`\`\`

### Frontend

\`\`\`bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

## 📚 Usage

### Creating a Lesson

1. **Start a conversation** with the lesson parameters:

\`\`\`
Subject: Mathematics
Lesson: Introduction to Fractions
Class: 5
Domain: Arithmetic
Area: Daily life measurements
Previous lesson: Basic division
\`\`\`

2. **Review each step** as it's generated:
   - The AI will generate objectives, situations, activities, etc.
   - Each step waits for your approval

3. **Approve or provide feedback**:
   - Type **"approve"** or **"looks good"** to continue
   - Type **"reject"** with feedback to regenerate
   - Type **"regenerate"** to try again

4. **Complete the lesson**: The system will guide you through all steps until your lesson plan is complete!

## 📖 API Endpoints

### ChatKit Endpoints
- `POST /api/chatkit/threads/create` - Create new chat thread
- `POST /api/chatkit/threads/:threadId/messages` - Add message to thread
- `POST /api/chatkit/threads/:threadId` - Get thread details

### Lesson Endpoints
- `POST /api/lessons` - Create lesson
- `GET /api/lessons/thread/:threadId` - Get lesson by thread
- `GET /api/lessons/:lessonId/steps` - Get all lesson steps
- `POST /api/lessons/:lessonId/steps/:stepSlug/generate` - Generate specific step
- `POST /api/lessons/:lessonId/steps/:stepSlug/approve` - Approve step
- `POST /api/lessons/:lessonId/steps/:stepSlug/reject` - Reject step

## 🗃️ Database Schema

### Tables
- **threads**: Chat thread metadata
- **thread_items**: Individual messages and items
- **attachments**: File attachments
- **lessons**: Lesson metadata and configuration
- **lesson_steps**: Individual lesson step data and status

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
\`\`\`env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=postgres
DATABASE_NAME=lesson_generator

OPENAI_API_KEY=your_openai_api_key

REDIS_HOST=localhost
REDIS_PORT=6379

PORT=3000
NODE_ENV=development
\`\`\`

## 🎨 Customization

### Adding New Lesson Steps

1. Add step to `FicheStep` enum in `lesson/types/lesson.types.ts`
2. Add prompt generator in `lesson/helpers/prompt.helper.ts`
3. Add to appropriate level config in `lesson/helpers/steps.config.ts`

### Modifying Prompts

Edit the prompt generators in `backend/src/lesson/helpers/prompt.helper.ts` to customize how each step is generated.

## 🧪 Testing

\`\`\`bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
\`\`\`

## 📦 Building for Production

\`\`\`bash
# Backend
cd backend
npm run build
npm run start:prod

# Frontend
cd frontend
npm run build
npm run preview
\`\`\`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- Based on the original Python `helper.ts` lesson planning system
- Built with [OpenAI ChatKit](https://openai.github.io/chatkit-js/)
- Powered by GPT-4 and OpenAI's API

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Happy Teaching! 📚✨**