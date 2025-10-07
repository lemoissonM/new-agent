# AI-Powered Lesson Generator

An intelligent lesson planning application that uses OpenAI's GPT to generate comprehensive, step-by-step lesson plans for teachers. Built with TypeScript, React, Express, PostgreSQL, and pgVector.

> 🚀 **Quick Start:** See [QUICKSTART.md](QUICKSTART.md) for a 5-minute setup guide!

![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-336791)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Features

- 🤖 **AI-Powered Generation**: Uses OpenAI GPT-4 to generate lesson content
- 📚 **Multi-Level Support**: Supports Maternelle, Primaire, and Secondaire education levels
- 🔄 **Step-by-Step Workflow**: Generate lessons incrementally with user approval at each step
- ✅ **Review & Refine**: Approve or request changes for each generated section
- 💾 **Persistent Storage**: PostgreSQL with pgVector for semantic search
- 🎨 **Modern UI**: Beautiful, responsive React interface
- 📊 **Progress Tracking**: Visual progress indicators for lesson completion

## Architecture

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- Custom UI components (no heavy frameworks)
- Real-time step generation with approval flow

### Backend
- **Express.js** with TypeScript
- **OpenAI API** for content generation
- **PostgreSQL** for data persistence
- **pgVector** for semantic search capabilities
- RESTful API with Server-Sent Events for streaming

### Database Schema
- `fiches`: Main lesson storage
- `step_history`: Track all step generations and revisions
- `lesson_embeddings`: Vector embeddings for semantic search

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+ with pgVector extension
- OpenAI API key

## Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd lesson-generator
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up PostgreSQL with pgVector**
```bash
# Install pgVector extension
# For Ubuntu/Debian:
sudo apt-get install postgresql-14-pgvector

# For macOS with Homebrew:
brew install pgvector
```

4. **Create database and run schema**
```bash
createdb lesson_generator
psql lesson_generator < server/database/schema.sql
```

5. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```env
OPENAI_API_KEY=sk-...your-key-here...
DATABASE_URL=postgresql://user:password@localhost:5432/lesson_generator
PORT=3001
```

## Running the Application

### Development Mode

Run both frontend and backend concurrently:
```bash
npm run dev:all
```

Or run them separately:

**Frontend only:**
```bash
npm run dev
```

**Backend only:**
```bash
npm run server
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001/api
- Health Check: http://localhost:3001/health

### Production Build

```bash
npm run build
npm run preview
```

## Usage

### Creating a New Lesson

1. Click "Create New Lesson" on the home page
2. Fill in the lesson details:
   - Subject (e.g., Mathematics, French)
   - Lesson Title
   - Class Level (Maternelle, Primaire, or Secondaire)
   - Area of Life (real-world context)
   - Optional: Domain, Previous Lesson, Content Outline

3. Click "Create Lesson" to proceed to the chat interface

### Generating Lesson Steps

The app guides you through multiple steps based on the education level:

**Secondaire (10 steps):**
- Objectives
- Revision (Teacher & Student)
- Situation
- Main Activity (Teacher & Student)
- Synthesis (Teacher & Student)
- Exercises
- Similar Situations

**Primaire (16 steps):**
- Objectives
- Recall (Teacher & Student)
- Motivation (Teacher & Student)
- Situation
- Main Activity (Teacher & Student)
- Synthesis (Teacher & Student)
- Application Exercises (Teacher & Student)
- Research (Teacher & Student)
- Evaluation (Teacher & Student)

**Maternelle (14 steps):**
- Similar to Primaire but adapted for younger children

For each step:
1. Click "Generate Content"
2. Review the AI-generated content
3. Either:
   - ✅ **Approve** to move to the next step
   - 🔄 **Regenerate** for a different version
   - ✎ **Request Changes** with specific feedback

## API Endpoints

### Fiches (Lessons)
- `POST /api/fiches` - Create a new lesson
- `GET /api/fiches` - Get all lessons
- `GET /api/fiches/:id` - Get lesson by ID
- `PATCH /api/fiches/:id` - Update lesson
- `DELETE /api/fiches/:id` - Delete lesson

### Steps
- `GET /api/fiches/:id/steps` - Get steps for a lesson
- `POST /api/fiches/:id/generate-step` - Generate content for a step
- `POST /api/fiches/:id/approve-step` - Approve or reject a step
- `POST /api/fiches/:id/generate-lesson` - Generate all steps (SSE)

## Project Structure

```
lesson-generator/
├── src/                      # Frontend source
│   ├── components/          # React components
│   │   ├── LessonList.tsx
│   │   ├── LessonWizard.tsx
│   │   ├── LessonChat.tsx
│   │   └── StepCard.tsx
│   ├── config/              # Configuration
│   │   ├── classes.ts
│   │   ├── steps.ts
│   │   └── fakeData.ts
│   ├── prompts/             # AI prompt generators
│   │   └── promptGenerators.ts
│   ├── types/               # TypeScript types
│   │   └── fiche.types.ts
│   ├── utils/               # Utility functions
│   │   ├── helpers.ts
│   │   └── courseMaterial.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── server/                   # Backend source
│   ├── agents/              # AI agents
│   │   └── LessonAgent.ts
│   ├── database/            # Database setup
│   │   ├── db.ts
│   │   └── schema.sql
│   ├── routes/              # API routes
│   │   └── ficheRoutes.ts
│   ├── services/            # Business logic
│   │   └── ficheService.ts
│   └── index.ts
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Technologies Used

### Frontend
- React 18
- TypeScript
- Vite
- CSS3 (Custom styling)

### Backend
- Node.js
- Express.js
- TypeScript
- OpenAI API (GPT-4)

### Database
- PostgreSQL 14+
- pgVector extension

### DevOps
- TSX for TypeScript execution
- Concurrently for parallel processes
- dotenv for environment management

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
- Create an issue on GitHub
- Contact the development team

## Acknowledgments

- OpenAI for GPT API
- pgVector for vector similarity search
- The open-source community

---

Built with ❤️ for teachers in the Democratic Republic of Congo