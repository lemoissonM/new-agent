# Getting Started - AI Lesson Generator

## 🎉 Welcome!

Your complete AI-powered lesson generator is ready! This guide will help you get started in minutes.

## ✅ What's Been Built

A **production-ready full-stack application** with:

### Backend (TypeScript/Node.js)
- ✅ Express API server
- ✅ OpenAI GPT-4 integration
- ✅ PostgreSQL + pgVector database
- ✅ 10+ AI agents for lesson steps
- ✅ RESTful API with full CRUD
- ✅ Session management
- ✅ Vector embeddings support

### Frontend (React/TypeScript)
- ✅ Modern React 18 application
- ✅ Vite build system
- ✅ Tailwind CSS styling
- ✅ Interactive step-by-step UI
- ✅ Real-time approval workflow
- ✅ State management with Zustand
- ✅ Responsive design

### Documentation
- ✅ README.md - Project overview
- ✅ SETUP.md - Detailed setup instructions
- ✅ ARCHITECTURE.md - Technical documentation
- ✅ API_DOCUMENTATION.md - Complete API reference
- ✅ PROJECT_SUMMARY.md - Quick overview
- ✅ Docker configuration

## 🚀 Quick Start (3 Steps)

### Step 1: Get OpenAI API Key

1. Go to https://platform.openai.com/
2. Sign up or log in
3. Navigate to API Keys
4. Create a new secret key
5. Copy it (starts with `sk-`)

### Step 2: Choose Your Setup Method

#### Option A: Docker (Recommended - Easiest)

```bash
# 1. Create environment file
echo "OPENAI_API_KEY=your-actual-key-here" > .env

# 2. Start everything with one command
docker-compose up

# That's it! 🎉
```

Visit: http://localhost:5173

#### Option B: Manual Setup

```bash
# 1. Install backend dependencies
cd backend
npm install

# 2. Create backend .env file
cat > .env << EOF
PORT=3000
OPENAI_API_KEY=your-actual-key-here
DATABASE_URL=postgresql://lesson_user:lesson_password@localhost:5432/lesson_generator
CORS_ORIGIN=http://localhost:5173
EOF

# 3. Install and start PostgreSQL with pgVector
# See SETUP.md for detailed database instructions

# 4. Start backend
npm run dev

# 5. In a NEW terminal, install frontend dependencies
cd ../frontend
npm install

# 6. Start frontend
npm run dev
```

Visit: http://localhost:5173

### Step 3: Create Your First Lesson

1. **Open** http://localhost:5173 in your browser
2. **Fill in** the lesson form:
   - Subject: "Mathematics"
   - Lesson Title: "Introduction to Fractions"
   - Class: "5ème Primaire"
   - Area of Life: "Finance"
3. **Click** "Start Lesson Generation"
4. **Watch** as AI generates each step
5. **Review** each step and approve or request changes
6. **Download** your complete lesson when done!

## 📁 Project Structure

```
workspace/
├── backend/                    # Express API
│   ├── src/
│   │   ├── agents/            # AI lesson generators
│   │   ├── database/          # PostgreSQL + pgVector
│   │   ├── routes/            # API endpoints
│   │   ├── types/             # TypeScript types
│   │   └── utils/             # Helpers & prompts
│   └── package.json
│
├── frontend/                   # React app
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/             # Pages
│   │   ├── services/          # API client
│   │   └── store/             # State management
│   └── package.json
│
├── README.md                   # Main documentation
├── SETUP.md                    # Setup guide
├── ARCHITECTURE.md             # Technical docs
├── API_DOCUMENTATION.md        # API reference
├── docker-compose.yml          # Docker config
└── start.sh                    # Quick start script
```

## 🎯 Key Features

### 1. Three Education Levels
- **Maternelle** (Nursery, ages 3-6)
- **Primaire** (Primary, ages 6-12)
- **Secondaire** (Secondary, ages 12-18)

### 2. AI-Generated Components
Each lesson includes:
- Learning objectives
- Revision questions
- Contextualized situation
- Main activities (teacher & student)
- Synthesis
- Exercises
- Evaluation

### 3. Interactive Workflow
- Generate → Review → Approve/Edit → Repeat
- Request changes with feedback
- AI regenerates based on your input
- Download complete lesson

### 4. Cultural Context
- DRC-specific names and places
- African cultural relevance
- Age-appropriate content
- Bilingual (French/English)

## 🛠️ Development Tools

### Backend Commands
```bash
cd backend
npm run dev        # Start development server
npm run build      # Build for production
npm run typecheck  # Check types
```

### Frontend Commands
```bash
cd frontend
npm run dev        # Start dev server with HMR
npm run build      # Build for production
npm run preview    # Preview production build
npm run typecheck  # Check types
```

## 📖 Documentation Guide

| File | Purpose | When to Read |
|------|---------|--------------|
| **GETTING_STARTED.md** | Quick start guide | Start here! |
| **README.md** | Project overview | Learn about features |
| **SETUP.md** | Detailed setup | Troubleshooting setup |
| **ARCHITECTURE.md** | Technical details | Understanding code |
| **API_DOCUMENTATION.md** | API reference | Building integrations |
| **PROJECT_SUMMARY.md** | High-level overview | Quick reference |

## 🎨 User Interface Preview

### Home Page
- Clean, modern design
- Easy-to-fill lesson creation form
- Validates inputs
- Shows statistics

### Lesson Workflow
- Step-by-step cards
- Progress indicator
- Real-time AI generation
- Approve/reject buttons
- Feedback textarea
- Download button when complete

## 🔧 Configuration

### Backend Environment (.env)
```env
PORT=3000                          # API server port
OPENAI_API_KEY=sk-...             # Required: Your OpenAI key
DATABASE_URL=postgresql://...      # PostgreSQL connection
CORS_ORIGIN=http://localhost:5173  # Frontend URL
```

### Frontend (automatic)
- Proxies API requests to backend
- Auto-connects to http://localhost:3000
- Hot Module Replacement enabled

## 🎓 Example Lesson Flow

1. **Create Lesson**
   ```
   Subject: Mathematics
   Title: Introduction to Fractions
   Class: 5ème Primaire
   ```

2. **AI Generates** (automatically):
   - Objectives: "Understand numerator and denominator..."
   - Rappel: "What is division?"
   - Motivation: "Use orange slices as teaching material..."
   - Situation: "In Kinshasa, Amina shares bread..."
   - ... (continues through all 16 steps)

3. **You Review** each step:
   - ✅ Approve → Next step
   - 🔄 Request changes → AI regenerates

4. **Result**: Complete, culturally-relevant lesson plan

## 🌍 Localization

The system automatically:
- Uses **French** for most subjects
- Uses **English** for English/Anglais subjects
- Includes DRC context (names, places)
- Adjusts complexity by age

## 🚨 Troubleshooting

### "Cannot connect to database"
```bash
# Check if PostgreSQL is running
docker ps  # (if using Docker)
# or
sudo systemctl status postgresql
```

### "OpenAI API error"
- Check your API key is correct
- Verify you have credits
- Ensure GPT-4 access

### "Port already in use"
- Change PORT in backend/.env
- Change port in frontend/vite.config.ts

### "Dependencies error"
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## 📞 Next Steps

1. ✅ Get it running (you're here!)
2. 📖 Read ARCHITECTURE.md to understand the code
3. 🎨 Customize prompts in `backend/src/utils/prompts.ts`
4. 🚀 Deploy to production (see SETUP.md)
5. 🤝 Contribute improvements

## 🎉 You're Ready!

Start the application and create your first AI-generated lesson plan!

```bash
# Quick start with Docker
docker-compose up

# Or manual start
cd backend && npm run dev
cd frontend && npm run dev  # in new terminal
```

Then open: **http://localhost:5173**

---

**Questions?** Check the documentation files or open an issue.

**Built with ❤️ for educators in the DRC**