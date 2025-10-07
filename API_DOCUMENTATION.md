# API Documentation

## Base URL

```
http://localhost:3000/api
```

## Authentication

Currently, no authentication is required. In production, implement API key or JWT authentication.

## Content Type

All requests and responses use `application/json`.

---

## Endpoints

### Health Check

#### GET `/health`

Check if the API is running.

**Response**
```json
{
  "status": "ok",
  "timestamp": "2025-10-07T12:00:00.000Z"
}
```

---

## Fiches (Lessons)

### Create a Fiche

#### POST `/api/fiches`

Create a new lesson plan.

**Request Body**
```json
{
  "subject": "Mathematics",
  "lessonTitle": "Introduction to Fractions",
  "classe": "10",
  "areaOfLife": "Finance",
  "domain": "Algebra",
  "previousLesson": "Basic Operations",
  "contentOutline": "Understanding numerators and denominators"
}
```

**Required Fields**
- `subject` (string): Subject name
- `lessonTitle` (string): Title of the lesson
- `classe` (string): Class level ID (1-15)

**Optional Fields**
- `areaOfLife` (string): Real-world application area
- `domain` (string): Subject domain
- `previousLesson` (string): Previous lesson title
- `contentOutline` (string): Lesson outline

**Response** (201 Created)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "subject": "Mathematics",
  "lessonTitle": "Introduction to Fractions",
  "classe": "10",
  "areaOfLife": "Finance",
  "domain": "Algebra",
  "previousLesson": "Basic Operations",
  "contentOutline": "Understanding numerators and denominators",
  "currentStep": 0,
  "status": "draft",
  "createdAt": "2025-10-07T12:00:00.000Z",
  "updatedAt": "2025-10-07T12:00:00.000Z"
}
```

---

### Get a Fiche

#### GET `/api/fiches/:id`

Retrieve a specific lesson by ID.

**Parameters**
- `id` (UUID): Fiche ID

**Response** (200 OK)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "subject": "Mathematics",
  "lessonTitle": "Introduction to Fractions",
  "classe": "10",
  "objectives": "1. Understand what fractions represent...",
  "situation": "In Kinshasa, Amina wants to share...",
  "currentStep": 3,
  "status": "in_progress"
}
```

**Error Response** (404 Not Found)
```json
{
  "error": "Fiche not found"
}
```

---

### Get All Fiches

#### GET `/api/fiches`

Retrieve all lessons with pagination.

**Query Parameters**
- `limit` (number, optional): Number of results (default: 50)
- `offset` (number, optional): Offset for pagination (default: 0)

**Request**
```
GET /api/fiches?limit=10&offset=0
```

**Response** (200 OK)
```json
[
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "subject": "Mathematics",
    "lessonTitle": "Introduction to Fractions",
    "status": "completed"
  },
  {
    "id": "234e5678-e89b-12d3-a456-426614174001",
    "subject": "Science",
    "lessonTitle": "The Water Cycle",
    "status": "in_progress"
  }
]
```

---

### Update a Fiche

#### PATCH `/api/fiches/:id`

Update specific fields of a lesson.

**Parameters**
- `id` (UUID): Fiche ID

**Request Body** (partial update)
```json
{
  "status": "completed",
  "objectives": "Updated objectives..."
}
```

**Response** (200 OK)
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "status": "completed",
  "objectives": "Updated objectives...",
  "updatedAt": "2025-10-07T12:30:00.000Z"
}
```

---

### Delete a Fiche

#### DELETE `/api/fiches/:id`

Delete a lesson permanently.

**Parameters**
- `id` (UUID): Fiche ID

**Response** (204 No Content)

No body returned on success.

**Error Response** (404 Not Found)
```json
{
  "error": "Fiche not found"
}
```

---

## Steps

### Get Steps for a Fiche

#### GET `/api/fiches/:id/steps`

Get all available steps for a lesson based on its class level.

**Parameters**
- `id` (UUID): Fiche ID

**Response** (200 OK)
```json
[
  {
    "title": "Objectifs",
    "slug": "objectives",
    "type": "general"
  },
  {
    "title": "Revision",
    "slug": "revisionTeacher",
    "type": "teacher"
  },
  {
    "title": "Revision",
    "slug": "revisionStudent",
    "type": "student"
  }
]
```

**Step Types**
- `general`: General information
- `teacher`: Teacher-focused content
- `student` / `eleve`: Student-focused content

---

### Execute a Step

#### POST `/api/fiches/:id/steps/:step/execute`

Generate content for a specific step using AI.

**Parameters**
- `id` (UUID): Fiche ID
- `step` (string): Step slug (e.g., "objectives", "situation")

**Request Body** (optional)
```json
{
  "userFeedback": "Make it more relevant to urban students"
}
```

**Response** (200 OK)
```json
{
  "step": "objectives",
  "content": "1. Understand the concept of fractions...\n2. Apply fractions to real-life scenarios...\n3. Solve basic fraction problems...",
  "status": "pending_approval"
}
```

**Error Response** (500 Internal Server Error)
```json
{
  "step": "objectives",
  "content": "",
  "status": "error",
  "error": "OpenAI API error: Rate limit exceeded"
}
```

---

### Approve a Step

#### POST `/api/fiches/:id/steps/:step/approve`

Approve a step and move to the next one.

**Parameters**
- `id` (UUID): Fiche ID
- `step` (string): Step slug

**Response** (200 OK)
```json
{
  "currentStep": 1,
  "nextStep": {
    "title": "Revision",
    "slug": "revisionTeacher",
    "type": "teacher"
  },
  "isCompleted": false
}
```

**When lesson is complete**
```json
{
  "currentStep": 10,
  "nextStep": null,
  "isCompleted": true
}
```

---

## Sessions

### Start a Session

#### POST `/api/fiches/:id/session/start`

Start a new lesson generation session.

**Parameters**
- `id` (UUID): Fiche ID

**Response** (201 Created)
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174002",
  "ficheId": "123e4567-e89b-12d3-a456-426614174000",
  "currentStepIndex": 0,
  "completedSteps": [],
  "pendingApproval": false,
  "createdAt": "2025-10-07T12:00:00.000Z",
  "updatedAt": "2025-10-07T12:00:00.000Z"
}
```

---

### Get a Session

#### GET `/api/fiches/:id/session/:sessionId`

Retrieve session details.

**Parameters**
- `id` (UUID): Fiche ID
- `sessionId` (UUID): Session ID

**Response** (200 OK)
```json
{
  "id": "456e7890-e89b-12d3-a456-426614174002",
  "ficheId": "123e4567-e89b-12d3-a456-426614174000",
  "currentStepIndex": 3,
  "completedSteps": ["objectives", "revisionTeacher", "revisionStudent"],
  "pendingApproval": true,
  "updatedAt": "2025-10-07T12:30:00.000Z"
}
```

---

## Step Slugs Reference

### All Levels
- `objectives`: Learning objectives

### Secondaire
- `revisionTeacher`: Teacher revision questions
- `revisionStudent`: Student revision answers
- `situation`: Contextualized scenario
- `activitePrincipaleTeacher`: Main activity (teacher)
- `activitePrincipaleStudent`: Main activity (student)
- `syntheseTeacher`: Synthesis questions (teacher)
- `syntheseStudent`: Synthesis answers (student)
- `exercice`: Exercises
- `situationSimilaire`: Similar situations

### Primaire & Maternelle
- `revisionTeacherRappel`: Recall questions (teacher)
- `revisionStudentRappel`: Recall answers (student)
- `revisionTeacherMotivation`: Motivation materials (teacher)
- `revisionStudentMotivation`: Motivation responses (student)
- `situation`: Contextualized scenario
- `activitePrincipaleTeacher`: Main activity (teacher)
- `activitePrincipaleStudent`: Main activity (student)
- `syntheseTeacher`: Synthesis outline (teacher)
- `syntheseStudent`: Synthesis content (student)
- `activiteControleApplicationTeacher`: Application exercises (teacher)
- `activiteControleApplicationStudent`: Application answers (student)
- `activiteControleResearchTeacher`: Research topics (teacher)
- `activiteControleResearchStudent`: Research answers (student)
- `activiteControleEvaluationTeacher`: Evaluation questions (teacher)
- `activiteControleEvaluationStudent`: Evaluation answers (student)

---

## Error Codes

| Code | Meaning |
|------|---------|
| 200  | Success |
| 201  | Created |
| 204  | No Content (successful deletion) |
| 400  | Bad Request (validation error) |
| 404  | Not Found |
| 500  | Internal Server Error |

---

## Rate Limiting

Currently not implemented. In production:
- Implement rate limiting per IP
- Limit OpenAI API calls per user
- Cache common requests

---

## Example Workflows

### Complete Lesson Generation

```javascript
// 1. Create a fiche
const fiche = await fetch('/api/fiches', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    subject: 'Mathematics',
    lessonTitle: 'Fractions',
    classe: '10'
  })
});
const { id } = await fiche.json();

// 2. Get steps
const stepsRes = await fetch(`/api/fiches/${id}/steps`);
const steps = await stepsRes.json();

// 3. Generate first step
const resultRes = await fetch(`/api/fiches/${id}/steps/${steps[0].slug}/execute`, {
  method: 'POST'
});
const result = await resultRes.json();

// 4. Approve and continue
await fetch(`/api/fiches/${id}/steps/${steps[0].slug}/approve`, {
  method: 'POST'
});

// Repeat 3-4 for all steps
```

### Regenerate with Feedback

```javascript
const result = await fetch(`/api/fiches/${id}/steps/objectives/execute`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userFeedback: 'Make objectives more specific and measurable'
  })
});
```

---

## Data Models

### Fiche Type

```typescript
interface Fiche {
  id?: string;
  subject: string;
  lessonTitle: string;
  classe: string;
  areaOfLife?: string;
  domain?: string;
  contentOutline?: string;
  previousLesson?: string;
  
  // Step content (populated as steps are generated)
  objectives?: string;
  revisionTeacher?: string;
  situation?: string;
  // ... etc
  
  currentStep?: number;
  status?: 'draft' | 'in_progress' | 'completed';
  createdAt?: Date;
  updatedAt?: Date;
}
```

### Step Definition Type

```typescript
interface StepDefinition {
  title: string;
  slug: FicheStep;
  type: 'general' | 'teacher' | 'student' | 'eleve';
}
```

### Step Execution Result Type

```typescript
interface StepExecutionResult {
  step: FicheStep;
  content: string;
  status: 'success' | 'error' | 'pending_approval';
  error?: string;
}
```

---

## Testing with cURL

### Create a lesson
```bash
curl -X POST http://localhost:3000/api/fiches \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "Mathematics",
    "lessonTitle": "Introduction to Fractions",
    "classe": "10"
  }'
```

### Get a lesson
```bash
curl http://localhost:3000/api/fiches/YOUR_FICHE_ID
```

### Execute a step
```bash
curl -X POST http://localhost:3000/api/fiches/YOUR_FICHE_ID/steps/objectives/execute \
  -H "Content-Type: application/json"
```

### Approve a step
```bash
curl -X POST http://localhost:3000/api/fiches/YOUR_FICHE_ID/steps/objectives/approve
```

---

## WebSocket Support (Future)

For real-time updates during lesson generation:

```javascript
const ws = new WebSocket('ws://localhost:3000/api/fiches/session');

ws.on('step:started', (data) => {
  console.log('Generating:', data.step);
});

ws.on('step:completed', (data) => {
  console.log('Completed:', data.step, data.content);
});
```

---

## Changelog

### v1.0.0
- Initial API release
- Full CRUD for fiches
- Step-by-step generation
- Session management
- OpenAI integration