# Architecture Documentation

## System Overview

The AI Lesson Generator is a full-stack TypeScript application that converts educational lesson planning from a manual process to an AI-assisted, step-by-step workflow.

## High-Level Architecture

\`\`\`
┌─────────────────┐
│   React App     │  ← User Interface (Vite + ChatKit React)
│  (Port 5173)    │
└────────┬────────┘
         │ HTTP/SSE
         ▼
┌─────────────────┐
│   NestJS API    │  ← Backend Server (ChatKit TypeScript)
│  (Port 3000)    │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌─────────┐ ┌──────────┐
│PostgreSQL│ │  OpenAI  │
│+pgVector │ │   API    │
│(Port 5432)│ └──────────┘
└──────────┘
    │
    ▼
┌─────────┐
│  Redis  │  ← Job Queue (BullMQ)
│(Port 6379)│
└─────────┘
\`\`\`

## Component Architecture

### Frontend (React + Vite)

**Technology Stack:**
- React 18
- TypeScript
- Vite (build tool)
- @openai/chatkit-react

**Structure:**
\`\`\`
frontend/
├── src/
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   ├── index.css         # Global styles
│   └── App.css           # Component styles
├── index.html
├── vite.config.ts
└── package.json
\`\`\`

**Key Features:**
- Real-time chat interface using ChatKit
- Server-Sent Events (SSE) for streaming
- Step-by-step lesson creation wizard
- User approval/rejection workflow

---

### Backend (NestJS)

**Technology Stack:**
- NestJS (Node.js framework)
- TypeScript
- TypeORM (database ORM)
- OpenAI SDK
- BullMQ (job queues)

**Module Structure:**
\`\`\`
backend/src/
├── chatkit/                    # ChatKit implementation
│   ├── types/                  # TypeScript types (converted from Python)
│   │   ├── base.types.ts
│   │   ├── thread.types.ts
│   │   ├── thread-item.types.ts
│   │   └── events.types.ts
│   ├── store/
│   │   └── typeorm.store.ts    # Database store implementation
│   ├── server/
│   │   └── chatkit.server.ts   # Main ChatKit server
│   ├── controllers/
│   │   └── chatkit.controller.ts
│   └── chatkit.module.ts
│
├── lesson/                     # Lesson generation logic
│   ├── types/
│   │   └── lesson.types.ts     # Lesson-specific types
│   ├── helpers/
│   │   ├── steps.config.ts     # Step configurations
│   │   └── prompt.helper.ts    # AI prompt generators
│   ├── services/
│   │   └── lesson.service.ts   # Core lesson logic
│   ├── controllers/
│   │   └── lesson.controller.ts
│   └── lesson.module.ts
│
├── database/
│   ├── entities/               # TypeORM entities
│   │   ├── thread.entity.ts
│   │   ├── thread-item.entity.ts
│   │   ├── attachment.entity.ts
│   │   ├── lesson.entity.ts
│   │   └── lesson-step.entity.ts
│   ├── migrations/             # Database migrations
│   └── data-source.ts
│
├── app.module.ts               # Root module
└── main.ts                     # Entry point
\`\`\`

---

## Data Flow

### 1. Lesson Creation Flow

\`\`\`
User Input → Frontend
    ↓
ChatKit Controller
    ↓
ChatKit Server.respond()
    ↓
Parse lesson parameters
    ↓
LessonService.createLesson()
    ↓
Database: Create lesson + initialize steps
    ↓
Generate first step (Objectives)
    ↓
Stream to user via SSE
\`\`\`

### 2. Step Generation Flow

\`\`\`
LessonService.generateStep()
    ↓
Load lesson + previous steps
    ↓
Build Fiche data object
    ↓
Get prompt generator for step
    ↓
Generate prompt (system + user)
    ↓
Call OpenAI API
    ↓
Save generated content
    ↓
Update step status: pending_approval
    ↓
Return content to user
\`\`\`

### 3. Approval Flow

\`\`\`
User approves step
    ↓
LessonService.approveStep()
    ↓
Update step status: approved
    ↓
Save user feedback
    ↓
Get next step
    ↓
Update lesson.current_step
    ↓
Trigger next step generation
\`\`\`

---

## Database Schema

### Core Tables

**threads**
- Primary thread metadata from ChatKit
- Stores conversation state

**thread_items**
- Individual messages and items
- JSONB data field for flexibility

**attachments**
- File attachments metadata
- Support for file and image types

**lessons**
- Main lesson metadata
- Links to thread
- Stores current step and status
- JSONB step_data for accumulated content

**lesson_steps**
- Individual step records
- Track status (pending → generating → pending_approval → approved)
- Store generated content
- User feedback

### Relationships

\`\`\`
Thread (1) ──────< (Many) ThreadItem
Thread (1) ────── (1) Lesson
Lesson (1) ──────< (Many) LessonStep
\`\`\`

---

## Key Design Patterns

### 1. Event-Driven Architecture
- Server-Sent Events for real-time updates
- Event-based communication between frontend and backend

### 2. Strategy Pattern
- Different prompt generators for each step
- Level-specific configurations (Maternelle, Primaire, Secondaire)

### 3. Repository Pattern
- TypeORM repositories abstract database operations
- Store interface for ChatKit compatibility

### 4. State Machine
- Lesson steps progress through defined states
- Ensures proper workflow ordering

---

## ChatKit Integration

The application uses a custom TypeScript implementation of OpenAI's ChatKit, converted from Python:

### Key Components:

1. **TypeORMStore**
   - Implements ChatKit's Store interface
   - Manages threads, items, and attachments in PostgreSQL

2. **ChatKitServer**
   - Main server class handling requests
   - Implements `respond()` method for streaming responses
   - Integrates with LessonService for domain logic

3. **Event Stream**
   - Server-Sent Events (SSE) for real-time updates
   - Multiple event types (thread.created, item.done, progress_update, etc.)

### Conversion Notes:
- Python `AsyncIterator` → TypeScript `AsyncGenerator`
- Pydantic models → TypeScript interfaces
- Python dataclasses → TypeScript types
- Maintained exact same API contract

---

## AI Integration

### OpenAI API Usage

**Model:** GPT-4o (configurable)

**Prompt Structure:**
Each step has a specialized prompt with:
1. **System Prompt:** Role and constraints
2. **User Prompt:** Specific request with context
3. **Assistant Prefix:** Optional starting text

**Context Building:**
- Accumulates previous step outputs
- Passes relevant lesson metadata
- Includes user-provided parameters

**Temperature:** 0.7 (balanced creativity/consistency)

---

## Scalability Considerations

### Current Architecture:
- Single server instance
- Direct OpenAI API calls
- Synchronous step generation

### Future Enhancements:
1. **Horizontal Scaling:**
   - Stateless backend design allows multiple instances
   - Redis for session management
   - Load balancer (Nginx/ALB)

2. **Async Processing:**
   - BullMQ for queue management
   - Background job workers
   - Webhook notifications

3. **Caching:**
   - Redis cache for common prompts
   - Response caching for similar lessons

4. **Vector Database:**
   - pgVector for semantic search
   - Find similar lessons
   - Content recommendations

---

## Security Considerations

### Current Implementation:
- No authentication (development only)
- CORS enabled for local development
- OpenAI API key in environment variables

### Production Requirements:
1. **Authentication & Authorization:**
   - JWT tokens
   - Role-based access control
   - API rate limiting

2. **Data Protection:**
   - Encrypt sensitive data at rest
   - HTTPS/TLS for all communications
   - Secure API key management (AWS Secrets Manager, etc.)

3. **Input Validation:**
   - Class-validator for DTOs
   - SQL injection prevention (TypeORM)
   - XSS protection

4. **Rate Limiting:**
   - Per-user API limits
   - OpenAI quota management
   - DDoS protection

---

## Monitoring & Observability

### Recommended Tools:
1. **Application Monitoring:**
   - Sentry for error tracking
   - Datadog/New Relic for APM

2. **Logging:**
   - Winston/Pino for structured logging
   - ELK stack for log aggregation

3. **Metrics:**
   - Prometheus for metrics collection
   - Grafana for visualization

4. **Health Checks:**
   - `/api/health` endpoint
   - Database connection monitoring
   - OpenAI API status

---

## Testing Strategy

### Unit Tests:
- Service layer logic
- Prompt generation
- Data transformations

### Integration Tests:
- API endpoints
- Database operations
- ChatKit events

### E2E Tests:
- Complete lesson creation flow
- User approval workflow
- Error handling

---

## Deployment Architecture

### Development:
\`\`\`
Docker Compose
├── PostgreSQL (pgVector)
├── Redis
├── Backend (watch mode)
└── Frontend (Vite dev server)
\`\`\`

### Production:
\`\`\`
Kubernetes/ECS
├── Load Balancer
├── Backend Pods (auto-scaling)
├── Frontend (CDN)
├── RDS PostgreSQL
├── ElastiCache Redis
└── OpenAI API
\`\`\`

---

## Performance Optimization

### Backend:
- Connection pooling (TypeORM)
- Async/await throughout
- Streaming responses (SSE)
- Database indexes on foreign keys

### Frontend:
- Code splitting (Vite)
- Lazy loading components
- Optimistic UI updates
- Debounced user inputs

### Database:
- Indexed foreign keys
- JSONB for flexible schema
- Pagination for large result sets
- Connection pooling

---

## Future Enhancements

1. **Multi-language Support:**
   - i18n for UI
   - Multiple language lesson generation

2. **Collaborative Editing:**
   - Real-time collaboration
   - Version history
   - Comment system

3. **Template Library:**
   - Save successful lessons as templates
   - Share with community
   - Import/export functionality

4. **Analytics:**
   - Usage statistics
   - Popular lesson topics
   - Success metrics

5. **Enhanced AI:**
   - Fine-tuned models for education
   - Multi-modal content (images, diagrams)
   - Adaptive difficulty

---

For implementation details, see the source code and inline documentation.