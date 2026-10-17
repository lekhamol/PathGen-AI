# AI Career Copilot – Generative AI Based Career Guidance System

**AI Career Copilot** is a Generative AI (GenAI)-powered web platform designed to help students and job seekers prepare for their dream careers. It analyzes resumes, compares qualifications against target Job Descriptions (JDs), identifies skill gaps, produces customized weekly study plans, recommends high-impact portfolio projects, and offers AI-powered mock interviews with instant technical and communication scoring.

---

## 🌟 Key Features

1. **AI Resume Parsing & Skill Extraction**:
   - Extract text from PDF resumes or raw text.
   - Automatically identify technical stacks, soft skills, education, and career experience highlights.
2. **Job Description Matching & Skill Gap Analysis**:
   - Semantic alignment between candidate profile and real-world job requirements.
   - Highlights **Matched Strengths**, **Critical Missing Qualifications**, and **Nice-to-Haves**.
   - Calculates candidate readiness score and overall role fit percentage.
3. **Adaptive Learning Roadmaps & Project Blueprints**:
   - Generates 4, 6, or 8-week structured study schedules tailored to close identified gaps.
   - Interactive weekly action checklists with progress tracking.
   - Curates portfolio project ideas with difficulty levels, core deliverables, and recommended learning resources.
4. **AI-Powered Mock Interview Simulator**:
   - Role-specific technical & behavioral (STAR method) interview questions.
   - Real-time scoring (0-100), technical depth analysis, communication clarity feedback, and benchmark model answers.
5. **Career Pipeline & Application Tracker**:
   - Manage job applications across pipeline stages: *Wishlist*, *Applied*, *Screening*, *Interview*, *Offer*, *Rejected*.
   - Track JD match percentage, salary range, and interview notes.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Responsibilities |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons | Responsive interactive dashboard, match score dials, roadmap checklists, interview simulator |
| **Backend API** | Java 17, Spring Boot 3.3+, Spring Data JPA, H2 / PostgreSQL | Enterprise REST APIs, application tracking, roadmap task persistence, AI microservice gateway |
| **AI Service** | Python 3.13, FastAPI, Google Gemini API, PyPDF, Pydantic | PDF resume extraction, LLM prompt orchestration, semantic skill gap engine, interview evaluator |
| **Database** | H2 (Zero-setup local) / PostgreSQL (Production) | Relational persistence for profiles, applications, and task progress |

---

## 🚀 Quick Start Guide

### 1. Start the Python AI Microservice (Port 8000)
```powershell
cd "ai-service"
# Activate the existing virtual environment
.\venv\Scripts\activate

# (Optional) Set your Google Gemini API Key in .env or run with built-in heuristic mode
# GEMINI_API_KEY=your_key_here

# Start FastAPI server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be available at: [http://localhost:8000/docs](http://localhost:8000/docs)

---

### 2. Start the Spring Boot Backend (Port 8080)
```powershell
cd "backend"
mvn spring-boot:run
```
- REST API Base: [http://localhost:8080/api/v1/career](http://localhost:8080/api/v1/career)
- H2 In-Memory Console: [http://localhost:8080/h2-console](http://localhost:8080/h2-console) (JDBC URL: `jdbc:h2:file:./data/careerdb`, User: `sa`, Password: empty)

---

### 3. Start the React Frontend (Port 3000)
```powershell
cd "frontend"
npm run dev
```
Open your browser and navigate to: **[http://localhost:3000](http://localhost:3000)**

---

## 📁 Repository Directory Structure

```
Path GEN AI/
├── ai-service/                # Python FastAPI Microservice
│   ├── app/
│   │   ├── config.py          # Environment settings
│   │   ├── main.py            # FastAPI endpoints
│   │   ├── schemas/           # Pydantic data models
│   │   └── services/          # Parser, LLM, Analyzer, Roadmap & Interview services
│   ├── requirements.txt
│   └── .env.example
├── backend/                   # Java Spring Boot 3 REST API
│   ├── src/main/java/com/career/copilot/
│   │   ├── controller/        # REST endpoints
│   │   ├── model/             # JPA entity models
│   │   ├── repository/        # Data repositories
│   │   └── service/           # AI gateway & Dashboard aggregator
│   ├── src/main/resources/    # application.yml
│   └── pom.xml
├── frontend/                  # React + Vite + Tailwind CSS
│   ├── src/
│   │   ├── components/        # Dashboard, ResumeMatcher, RoadmapView, MockInterview, ApplicationTracker
│   │   ├── services/          # api.js client
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   └── vite.config.js
└── README.md
```
