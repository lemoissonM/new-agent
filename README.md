# AI Lesson Generator

A comprehensive AI-powered lesson plan generator for the DRC educational system, supporting Maternelle, Primaire, and Secondaire levels. Built with TypeScript, React, OpenAI, PostgreSQL, and pgVector.

## 🌟 Features

- **Multi-Level Support**: Generates lessons for Maternelle (nursery), Primaire (primary), and Secondaire (secondary) education levels
- **AI-Powered Generation**: Uses OpenAI GPT-4 to create culturally-relevant, age-appropriate lesson content
- **Step-by-Step Workflow**: 10+ lesson components generated sequentially with user approval at each step
- **Interactive UI**: Modern React interface with real-time feedback and regeneration capabilities
- **PostgreSQL + pgVector**: Robust data storage with vector embeddings for future semantic search
- **DRC Context**: Lessons incorporate African context with local names, places, and cultural relevance

## 📋 Lesson Steps

Each lesson is generated through multiple steps tailored to the educational level:

### Secondaire (Secondary)
1. Objectives
2. Revision (Teacher & Student)
3. Situation
4. Activité Principale (Teacher & Student)
5. Synthèse (Teacher & Student)
6. Exercice
7. Situation Similaires

### Primaire (Primary)
1. Objectives
2. Rappel (Teacher & Student)
3. Motivation (Teacher & Student)
4. Situation
5. Activité Principale (Teacher & Student)
6. Synthèse (Teacher & Student)
7. Application, Recherche, Evaluation (Teacher & Student)

### Maternelle (Nursery)
Similar structure to Primaire with age-appropriate adjustments

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 14+ with pgVector extension
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd workspace
```

2. **Set up Backend**
```bash
cd backend
npm install

# Copy and configure environment variables
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY and DATABASE_URL
```

3. **Set up Database**
```bash
# Create PostgreSQL database
createdb lesson_generator

# The app will automatically initialize tables and pgVector extension on first run
```

4. **Set up Frontend**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start the Backend**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:3000
```

2. **Start the Frontend** (in a new terminal)
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

3. **Open your browser** and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
workspace/
├── backend/
│   ├── src/
│   │   ├── agents/           # OpenAI agent logic
│   │   │   └── lesson-agent.ts
│   │   ├── database/         # Database configuration and repositories
│   │   │   ├── db.ts
│   │   │   └── fiche.repository.ts
│   │   ├── routes/           # Express API routes
│   │   │   └── fiche.routes.ts
│   │   ├── types/            # TypeScript type definitions
│   │   │   └── fiche.types.ts
│   │   ├── utils/            # Helper functions and prompts
│   │   │   ├── constants.ts
│   │   │   ├── course-material.ts
│   │   │   ├── parser.ts
│   │   │   └── prompts.ts
│   │   └── index.ts          # Entry point
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── LessonForm.tsx
│   │   │   ├── LessonWorkflow.tsx
│   │   │   └── StepCard.tsx
│   │   ├── pages/            # Page components
│   │   │   └── Home.tsx
│   │   ├── services/         # API services
│   │   │   └── api.ts
│   │   ├── store/            # State management (Zustand)
│   │   │   └── lessonStore.ts
│   │   ├── types/            # TypeScript types
│   │   │   └── fiche.types.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── README.md
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
PORT=3000
OPENAI_API_KEY=your_openai_api_key_here
DATABASE_URL=postgresql://user:password@localhost:5432/lesson_generator
PGVECTOR_ENABLED=true
CORS_ORIGIN=http://localhost:5173
```

### Database Schema

The application automatically creates the following tables:

- `fiches`: Stores lesson plans with all generated content
- `lesson_sessions`: Tracks lesson generation sessions
- `lesson_embeddings`: Stores vector embeddings for semantic search (pgVector)

## 🎯 Usage

1. **Create a New Lesson**
   - Fill in the lesson details (subject, class level, title, etc.)
   - Click "Start Lesson Generation"

2. **Step-by-Step Generation**
   - Each step is generated automatically using AI
   - Review the generated content
   - Approve to continue or request changes with feedback
   - The AI will regenerate based on your feedback

3. **Complete and Download**
   - Once all steps are approved, download the complete lesson plan
   - JSON format includes all generated content

## 🧪 API Endpoints

### Fiches (Lessons)
- `POST /api/fiches` - Create a new lesson
- `GET /api/fiches/:id` - Get lesson by ID
- `GET /api/fiches` - Get all lessons
- `PATCH /api/fiches/:id` - Update lesson
- `DELETE /api/fiches/:id` - Delete lesson

### Steps
- `GET /api/fiches/:id/steps` - Get all steps for a lesson
- `POST /api/fiches/:id/steps/:step/execute` - Execute a specific step
- `POST /api/fiches/:id/steps/:step/approve` - Approve a step

### Sessions
- `POST /api/fiches/:id/session/start` - Start a lesson session
- `GET /api/fiches/:id/session/:sessionId` - Get session details

## 🛠️ Technologies

### Backend
- TypeScript
- Express.js
- OpenAI API (GPT-4)
- PostgreSQL
- pgVector (vector database)
- Zod (validation)

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand (state management)
- Axios
- Lucide React (icons)

## 📝 Development

### Backend Development
```bash
cd backend
npm run dev        # Start development server
npm run build      # Build for production
npm run typecheck  # Type checking
```

### Frontend Development
```bash
cd frontend
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run typecheck  # Type checking
```

## 🌍 Localization

The system automatically generates content in:
- **French**: For most subjects
- **English**: For English/Anglais subjects

Lessons include African context with:
- DRC-specific locations (Kinshasa, Goma, Bukavu, etc.)
- Local names (Amina, Bakari, Chantal, etc.)
- Culturally relevant examples

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- DRC educational system framework
- All contributors and educators

## 📞 Support

For issues, questions, or contributions, please open an issue on GitHub.

---

Built with ❤️ for educators in the Democratic Republic of Congo