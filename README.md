# 🛫 Smart Visa Assistant Platform (SVAP)

> An AI-powered, full-stack web application that simplifies international visa applications for travelers worldwide.

![Angular](https://img.shields.io/badge/Angular-17+-DD0031?style=flat&logo=angular)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat&logo=node.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=flat&logo=postgresql)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=flat&logo=typescript)

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🌍 **Country Dashboard** | Search & browse 10+ countries with visa info |
| 📋 **Smart Checklist** | Personalized document checklist by profile |
| 📖 **Step-by-Step Guide** | 8-step application walkthrough with tips |
| 🤖 **AI Chat Assistant** | RAG-powered visa Q&A bot |
| 📊 **Application Tracker** | Track visa applications with progress steps |
| 🌙 **Dark/Light Theme** | System-aware theme with toggle |
| 📱 **Fully Responsive** | Mobile-first design |
| ⚡ **SSR Enabled** | Angular 17+ with Server-Side Rendering |

---

## 🏗️ Project Structure

```
svap/
├── client/                    # Angular 17+ Frontend (SSR)
│   └── src/
│       ├── app/
│       │   ├── core/
│       │   │   ├── models/    # TypeScript interfaces
│       │   │   └── services/  # Business logic services
│       │   ├── features/
│       │   │   ├── home/              # Country search dashboard
│       │   │   ├── country-overview/  # Visa details page
│       │   │   ├── checklist/         # Document checklist generator
│       │   │   ├── guide/             # Step-by-step guide
│       │   │   ├── chat/              # AI chat interface
│       │   │   └── dashboard/         # Application tracker
│       │   └── shared/
│       │       └── components/        # Navbar, shared UI
│       └── styles.scss                # Global design system
│
├── server/                    # Node.js + Express Backend
│   ├── src/
│   │   ├── app.js             # Express entry point
│   │   └── routes/
│   │       ├── visa.routes.js
│   │       ├── chat.routes.js
│   │       ├── auth.routes.js
│   │       └── application.routes.js
│   └── database/
│       └── schema.sql         # PostgreSQL schema
│
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 20+
- npm 10+
- PostgreSQL 15+ (optional for full backend)

### 1. Start the Frontend

```bash
cd client
npm install
npm run dev
```

App runs at: **http://localhost:4200**

### 2. Start the Backend (Optional)

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

API runs at: **http://localhost:3000**

### 3. Setup Database (Optional)

```bash
# Create database
createdb svap_db

# Run schema
psql -d svap_db -f server/database/schema.sql
```

---

## 🎨 Design System

The app uses a custom CSS design system with:

- **Glassmorphism** cards with backdrop blur
- **CSS Custom Properties** for theming
- **Dark/Light mode** with system preference detection
- **Gradient backgrounds** and animated orbs
- **Inter + Outfit** Google Fonts
- **Responsive grid** layouts

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/visa/countries` | List all countries |
| GET | `/api/visa/countries/:id` | Get country details |
| GET | `/api/visa/regions` | Get all regions |
| GET | `/api/visa/stats` | Platform statistics |
| POST | `/api/chat/message` | Send chat message |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/applications` | List applications |
| POST | `/api/applications` | Create application |
| PATCH | `/api/applications/:id/status` | Update status |
| DELETE | `/api/applications/:id` | Delete application |

---

## 🗄️ Database Schema

Key tables:
- `users` — User accounts with JWT auth
- `countries` — Country master data
- `visa_types` — Visa types per country
- `visa_requirements` — Document requirements
- `document_templates` — Reusable document definitions
- `applications` — User visa applications
- `application_steps` — Progress tracking steps
- `chat_sessions` + `chat_messages` — Chat history

---

## 🤖 AI Architecture (RAG Pipeline)

```
User Query
    ↓
Query Embedding (OpenAI text-embedding-3-small)
    ↓
Vector Search (Pinecone)
    ↓
Retrieve Relevant Embassy Documents
    ↓
Augmented Prompt → LLM (GPT-4o)
    ↓
Contextual Answer with Sources
```

**Knowledge Base Sources:**
- Official embassy visa guidelines
- Government immigration websites
- VFS/BLS processing guides
- Country-specific requirements

---

## 🚢 Deployment

### Frontend (Vercel / Netlify)

```bash
cd client
npm run build
# Deploy dist/client/browser to Vercel/Netlify
```

### Backend (Railway / Render / AWS)

```bash
cd server
# Set environment variables in your platform
npm start
```

### Docker (Full Stack)

```bash
docker-compose up -d
```

---

## 📋 Environment Variables

See `server/.env.example` for all required variables.

---

## 🛡️ Security

- Helmet.js for HTTP security headers
- CORS configured for specific origins
- JWT authentication (production-ready structure)
- Input validation on all endpoints
- SQL injection prevention via parameterized queries

---

## 📄 License

MIT License — Built for educational and portfolio purposes.

> ⚠️ **Disclaimer:** Always verify visa requirements on official embassy websites. Visa rules change frequently.
