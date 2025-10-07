# API Documentation

## Base URL
\`\`\`
http://localhost:3000/api
\`\`\`

## Authentication
Currently, the API does not require authentication. For production, implement JWT or API key authentication.

---

## ChatKit Endpoints

### Create New Thread
Create a new chat thread with an initial message.

**Endpoint:** `POST /chatkit/threads/create`

**Request Body:**
\`\`\`json
{
  "input": {
    "content": [
      {
        "type": "input_text",
        "text": "Subject: Mathematics\nLesson: Introduction to Fractions\nClass: 5"
      }
    ],
    "attachments": [],
    "inference_options": {
      "model": "gpt-4o",
      "tool_choice": null
    }
  }
}
\`\`\`

**Response:** Server-Sent Events (SSE) stream
\`\`\`
data: {"type":"thread.created","thread":{...}}
data: {"type":"thread.item.done","item":{...}}
data: {"type":"progress_update","text":"Creating lesson plan..."}
...
\`\`\`

---

### Add Message to Thread
Add a new message to an existing thread.

**Endpoint:** `POST /chatkit/threads/:threadId/messages`

**Path Parameters:**
- `threadId` (string): The thread ID

**Request Body:**
\`\`\`json
{
  "input": {
    "content": [
      {
        "type": "input_text",
        "text": "approve"
      }
    ],
    "attachments": [],
    "inference_options": {}
  }
}
\`\`\`

**Response:** Server-Sent Events (SSE) stream

---

### Get Thread Details
Retrieve thread information and messages.

**Endpoint:** `POST /chatkit/threads/:threadId`

**Path Parameters:**
- `threadId` (string): The thread ID

**Response:**
\`\`\`json
{
  "id": "thr_abc123",
  "title": null,
  "created_at": "2024-01-15T10:30:00Z",
  "status": {
    "type": "active"
  },
  "items": {
    "data": [...],
    "has_more": false,
    "after": null
  }
}
\`\`\`

---

## Lesson Endpoints

### Create Lesson
Create a new lesson plan.

**Endpoint:** `POST /lessons`

**Request Body:**
\`\`\`json
{
  "threadId": "thr_abc123",
  "subject": "Mathematics",
  "lessonTitle": "Introduction to Fractions",
  "classe": "5",
  "domain": "Arithmetic",
  "areaOfLife": "Daily life measurements",
  "previousLesson": "Basic division",
  "contentOutline": "Understanding parts of a whole"
}
\`\`\`

**Response:**
\`\`\`json
{
  "id": "uuid-lesson-id",
  "thread_id": "thr_abc123",
  "subject": "Mathematics",
  "lesson_title": "Introduction to Fractions",
  "classe": "5",
  "level": "primaire",
  "current_step": "objectives",
  "status": "in_progress",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
\`\`\`

---

### Get Lesson by Thread ID
Retrieve lesson information for a specific thread.

**Endpoint:** `GET /lessons/thread/:threadId`

**Path Parameters:**
- `threadId` (string): The thread ID

**Response:**
\`\`\`json
{
  "id": "uuid-lesson-id",
  "thread_id": "thr_abc123",
  "subject": "Mathematics",
  "lesson_title": "Introduction to Fractions",
  "classe": "5",
  "domain": "Arithmetic",
  "level": "primaire",
  "current_step": "objectives",
  "status": "in_progress",
  "step_data": {
    "objectives": "1. Understand what fractions are...",
    "revisionTeacherRappel": "..."
  }
}
\`\`\`

---

### Get Lesson Steps
Retrieve all steps for a lesson with their status.

**Endpoint:** `GET /lessons/:lessonId/steps`

**Path Parameters:**
- `lessonId` (string): The lesson ID

**Response:**
\`\`\`json
[
  {
    "id": "uuid-step-1",
    "lesson_id": "uuid-lesson-id",
    "step_slug": "objectives",
    "step_title": "Objectifs",
    "step_type": "general",
    "content": "1. Understand what fractions represent...",
    "status": "approved",
    "order": 0,
    "created_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": "uuid-step-2",
    "lesson_id": "uuid-lesson-id",
    "step_slug": "revisionTeacherRappel",
    "step_title": "Rappel",
    "step_type": "teacher",
    "content": null,
    "status": "pending",
    "order": 1,
    "created_at": "2024-01-15T10:30:00Z"
  }
]
\`\`\`

---

### Generate Step
Generate content for a specific lesson step.

**Endpoint:** `POST /lessons/:lessonId/steps/:stepSlug/generate`

**Path Parameters:**
- `lessonId` (string): The lesson ID
- `stepSlug` (string): The step slug (e.g., "objectives", "situation")

**Response:**
\`\`\`json
{
  "content": "1. Understand what fractions are and how they represent parts of a whole...",
  "stepData": {
    "objectives": "1. Understand what fractions...",
    "situation": null
  }
}
\`\`\`

---

### Approve Step
Approve a generated step and move to the next one.

**Endpoint:** `POST /lessons/:lessonId/steps/:stepSlug/approve`

**Path Parameters:**
- `lessonId` (string): The lesson ID
- `stepSlug` (string): The step slug

**Request Body:**
\`\`\`json
{
  "comment": "Looks great!",
  "modifications": null
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true
}
\`\`\`

---

### Reject Step
Reject a generated step and provide feedback.

**Endpoint:** `POST /lessons/:lessonId/steps/:stepSlug/reject`

**Path Parameters:**
- `lessonId` (string): The lesson ID
- `stepSlug` (string): The step slug

**Request Body:**
\`\`\`json
{
  "reason": "Too complex for this age group",
  "suggestions": "Please simplify the language"
}
\`\`\`

**Response:**
\`\`\`json
{
  "success": true
}
\`\`\`

---

## Lesson Step Slugs

### For Secondaire (Secondary Level, Class 7-12)
- `objectives` - Learning objectives
- `revisionTeacher` - Revision questions (teacher)
- `revisionStudent` - Revision answers (student)
- `situation` - Real-life situation/case study
- `activitePrincipaleTeacher` - Main activity instructions (teacher)
- `activitePrincipaleStudent` - Main activity responses (student)
- `syntheseTeacher` - Summary questions (teacher)
- `syntheseStudent` - Summary content (student)
- `exercice` - Exercises
- `situationSimilaire` - Similar situations

### For Primaire (Primary Level, Class 1-6)
- `objectives` - Learning objectives
- `revisionTeacherRappel` - Recall questions (teacher)
- `revisionStudentRappel` - Recall answers (student)
- `revisionTeacherMotivation` - Motivation materials (teacher)
- `revisionStudentMotivation` - Student motivation response
- `situation` - Real-life situation
- `activitePrincipaleTeacher` - Main activity (teacher)
- `activitePrincipaleStudent` - Main activity (student)
- `syntheseTeacher` - Summary outline (teacher)
- `syntheseStudent` - Summary content (student)
- `activiteControleApplicationTeacher` - Application exercises (teacher)
- `activiteControleApplicationStudent` - Application solutions (student)
- `activiteControleResearchTeacher` - Research topics (teacher)
- `activiteControleResearchStudent` - Research responses (student)
- `activiteControleEvaluationTeacher` - Evaluation exercises (teacher)
- `activiteControleEvaluationStudent` - Evaluation solutions (student)

### For Maternelle (Nursery Level, Ages 2-5)
Similar to Primaire but adapted for younger children.

---

## Event Types (SSE)

### Thread Events
- `thread.created` - New thread created
- `thread.updated` - Thread metadata updated
- `thread.item.added` - New item added to thread
- `thread.item.done` - Item completed
- `thread.item.updated` - Item updated
- `thread.item.removed` - Item removed
- `thread.item.replaced` - Item replaced

### Progress Events
- `progress_update` - Progress notification with text and optional icon

### Error Events
- `error` - Error occurred with code and message
- `notice` - User-facing notice (info/warning/danger)

---

## Status Values

### Lesson Status
- `in_progress` - Lesson is being created
- `completed` - All steps approved
- `cancelled` - Lesson creation cancelled

### Step Status
- `pending` - Not yet started
- `generating` - Currently being generated
- `pending_approval` - Waiting for user approval
- `approved` - Approved by user
- `rejected` - Rejected by user

---

## Error Codes

- `STREAM_ERROR` - Generic streaming error
- `NOT_FOUND` - Resource not found
- `INVALID_INPUT` - Invalid request data
- `OPENAI_ERROR` - OpenAI API error
- `DATABASE_ERROR` - Database operation failed

---

## Rate Limiting

Currently no rate limiting is implemented. For production:
- Implement rate limiting per user/IP
- Consider OpenAI API rate limits
- Add request queuing for high load

---

## Examples

### Complete Workflow Example

1. **Create a new thread with lesson request:**
\`\`\`bash
curl -X POST http://localhost:3000/api/chatkit/threads/create \\
  -H "Content-Type: application/json" \\
  -d '{
    "input": {
      "content": [{
        "type": "input_text",
        "text": "Subject: Mathematics\\nLesson: Fractions\\nClass: 5"
      }],
      "attachments": [],
      "inference_options": {}
    }
  }'
\`\`\`

2. **Wait for objectives to be generated, then approve:**
\`\`\`bash
curl -X POST http://localhost:3000/api/chatkit/threads/thr_abc123/messages \\
  -H "Content-Type: application/json" \\
  -d '{
    "input": {
      "content": [{
        "type": "input_text",
        "text": "approve"
      }],
      "attachments": [],
      "inference_options": {}
    }
  }'
\`\`\`

3. **Continue approving each step until lesson is complete**

---

For more information, see the main README.md file.