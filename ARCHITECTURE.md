# Architecture Documentation

## System Overview

The AI Lesson Generator is a full-stack TypeScript application that generates educational lesson plans using OpenAI's GPT-4 model. The system follows a step-by-step workflow where each lesson component is generated sequentially and requires user approval before proceeding.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (React)                      │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ LessonForm  │  │ LessonWorkflow│  │   StepCard       │  │
│  └─────────────┘  └──────────────┘  └──────────────────┘  │
│         │                  │                    │           │
│         └──────────────────┴────────────────────┘           │
│                            │                                 │
│                     ┌──────▼───────┐                        │
│                     │  API Service │                        │
│                     └──────────────┘                        │
└────────────────────────────┬────────────────────────────────┘
                             │ HTTP/REST
┌────────────────────────────▼────────────────────────────────┐
│                    Backend (Express/Node.js)                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ Fiche Routes │  │ Lesson Agent │  │  Prompt Helpers  │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────┘  │
│         │                  │                                 │
│         │           ┌──────▼───────┐                        │
│         │           │  OpenAI API  │                        │
│         │           └──────────────┘                        │
│         │                                                    │
│  ┌──────▼──────────────────────────────────────────────┐   │
│  │           Fiche Repository                          │   │
│  └──────┬──────────────────────────────────────────────┘   │
└─────────┼─────────────────────────────────────────────────┘
          │
┌─────────▼─────────────────────────────────────────────────┐
│              PostgreSQL + pgVector                         │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   fiches   │  │   sessions   │  │   embeddings     │  │
│  └────────────┘  └──────────────┘  └──────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend Layer

#### 1. **React Application**
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: Zustand

#### 2. **Key Components**

**LessonForm**
- Purpose: Initial lesson creation form
- Collects: Subject, class level, title, domain, etc.
- Validates input before submission

**LessonWorkflow**
- Purpose: Main workflow orchestrator
- Manages: Step progression, approval flow
- Displays: Progress, current step, completed steps

**StepCard**
- Purpose: Individual step UI component
- Features: Generate, approve, reject, regenerate with feedback
- Shows: Step content, status, type (teacher/student/general)

#### 3. **State Management**

```typescript
interface LessonState {
  currentFiche: Fiche | null;
  steps: StepDefinition[];
  currentStepIndex: number;
  isGenerating: boolean;
  error: string | null;
}
```

### Backend Layer

#### 1. **Express Server**
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Validation**: Zod schemas
- **CORS**: Configured for frontend origin

#### 2. **Core Modules**

**Lesson Agent** (`lesson-agent.ts`)
- Interfaces with OpenAI API
- Generates embeddings
- Executes individual steps
- Manages prompt construction

```typescript
class LessonAgent {
  async executeStep(fiche, step, feedback?) -> StepExecutionResult
  async generateEmbedding(text) -> number[]
  async executeAllSteps(fiche, callback?) -> Fiche
}
```

**Fiche Repository** (`fiche.repository.ts`)
- Data access layer
- CRUD operations for lessons
- Session management
- SQL query abstraction

**Prompt Helpers** (`prompts.ts`)
- Prompt generation for each step
- Level-specific prompts (Maternelle, Primaire, Secondaire)
- Context injection (names, places, cultural elements)

#### 3. **API Endpoints**

```
POST   /api/fiches                           Create lesson
GET    /api/fiches/:id                       Get lesson
PATCH  /api/fiches/:id                       Update lesson
DELETE /api/fiches/:id                       Delete lesson
GET    /api/fiches/:id/steps                 Get steps
POST   /api/fiches/:id/steps/:step/execute   Execute step
POST   /api/fiches/:id/steps/:step/approve   Approve step
POST   /api/fiches/:id/session/start         Start session
```

### Database Layer

#### 1. **PostgreSQL Schema**

**fiches table**
```sql
- id (UUID, primary key)
- subject, lesson_title, classe, domain
- All step content fields (objectives, situation, etc.)
- current_step, status
- created_at, updated_at
```

**lesson_sessions table**
```sql
- id (UUID, primary key)
- fiche_id (foreign key)
- current_step_index
- completed_steps (array)
- pending_approval (boolean)
```

**lesson_embeddings table**
```sql
- id (UUID, primary key)
- fiche_id (foreign key)
- step_name
- content (text)
- embedding (vector 1536)
```

#### 2. **pgVector Integration**
- Stores 1536-dimension embeddings
- Uses IVFFlat index for similarity search
- Cosine similarity for vector operations

## Data Flow

### 1. Lesson Creation Flow

```
User fills form → Frontend validates → POST /api/fiches
                                              ↓
                                    Create fiche in DB
                                              ↓
                                    Return fiche with ID
                                              ↓
                            Navigate to /lesson/:id
```

### 2. Step Generation Flow

```
User clicks "Generate" → POST /api/fiches/:id/steps/:step/execute
                                              ↓
                                Get current fiche from DB
                                              ↓
                         Generate prompt from template + fiche data
                                              ↓
                                   Call OpenAI API (GPT-4)
                                              ↓
                               Receive generated content
                                              ↓
                            Update fiche in DB with content
                                              ↓
                        Return content to frontend
                                              ↓
                          Display in StepCard
```

### 3. Approval Flow

```
User clicks "Approve" → POST /api/fiches/:id/steps/:step/approve
                                              ↓
                                Mark step as completed
                                              ↓
                            Increment current_step_index
                                              ↓
                            Return next step info
                                              ↓
                        Frontend moves to next step
```

### 4. Regeneration Flow

```
User provides feedback → POST /api/fiches/:id/steps/:step/execute
                                  (with userFeedback)
                                              ↓
                        Generate new prompt with feedback
                                              ↓
                                   Call OpenAI API
                                              ↓
                             Update fiche with new content
```

## AI Integration

### OpenAI Configuration

- **Model**: GPT-4 (gpt-4o)
- **Temperature**: 0.7 (balanced creativity/consistency)
- **Max Tokens**: 2000 per request
- **Embeddings**: text-embedding-3-small (1536 dimensions)

### Prompt Engineering

Each step has three components:

1. **System Prompt**: Sets role, constraints, language
2. **User Prompt**: Provides context and specific instructions
3. **Assistant Start**: Primes the response format

Example structure:
```typescript
{
  systemPrompt: "You are a teacher of Mathematics...",
  userPrompt: "Create 3 objectives for lesson X...",
  assistant: "1. "  // Primes numbered list
}
```

### Context Injection

Prompts automatically inject:
- Student age range based on class level
- Class size expectations
- Language (French/English based on subject)
- African cultural context (DRC names, places)
- Subject-specific materials

## Educational Levels

### Maternelle (Ages 3-6)
- Simplified language
- Concrete, sensory-based activities
- Shorter exercises
- Focus on discovery and play

### Primaire (Ages 6-12)
- Progressive complexity
- Real-world applications
- Research components
- Balance theory and practice

### Secondaire (Ages 12-18)
- Advanced concepts
- Academic rigor
- Critical thinking exercises
- Preparation for higher education

## Security Considerations

1. **API Key Protection**: OpenAI key stored in environment variables
2. **Input Validation**: Zod schemas validate all inputs
3. **SQL Injection Prevention**: Parameterized queries
4. **CORS**: Restricted to frontend origin
5. **Rate Limiting**: Should be added for production

## Scalability Considerations

1. **Database**: Indexed on frequently queried fields
2. **Caching**: Can add Redis for prompt templates
3. **Queue System**: Can add Bull for async step generation
4. **Load Balancing**: Backend can be horizontally scaled
5. **CDN**: Frontend static assets

## Future Enhancements

1. **Vector Search**: Semantic similarity search for lessons
2. **Multi-language**: Support for additional languages
3. **Collaboration**: Multiple teachers working on same lesson
4. **Templates**: Pre-built lesson templates
5. **Export Formats**: PDF, Word, etc.
6. **Analytics**: Track lesson effectiveness
7. **Versioning**: History of lesson revisions

## Development Workflow

```
1. Make changes to code
2. Backend: npm run dev (auto-reload)
3. Frontend: npm run dev (HMR)
4. Test in browser
5. Run type checking: npm run typecheck
6. Commit changes
```

## Testing Strategy

- **Unit Tests**: Individual functions and components
- **Integration Tests**: API endpoints
- **E2E Tests**: Complete user workflows
- **Load Tests**: Performance under concurrent users

## Monitoring

Recommended monitoring:
- Application logs (Winston/Pino)
- Database query performance
- OpenAI API latency and costs
- Error tracking (Sentry)
- User analytics (Plausible/Umami)