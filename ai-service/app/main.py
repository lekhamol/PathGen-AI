import os
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional

from app.config import settings
from app.schemas.models import (
    ResumeAnalysisRequest, ResumeAnalysisResponse,
    JobMatchRequest, JobMatchResponse,
    RoadmapRequest, RoadmapResponse,
    InterviewStartRequest, InterviewStartResponse,
    InterviewEvaluateRequest, InterviewEvaluateResponse
)
from app.services.parser_service import parser_service
from app.services.analyzer_service import analyzer_service
from app.services.roadmap_service import roadmap_service
from app.services.interview_service import interview_service

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="GenAI-powered microservice for resume parsing, job matching, learning roadmaps, and mock interviews.",
    version="1.0.0"
)

# Enable CORS for frontend and Spring Boot backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "gemini_configured": bool(settings.GEMINI_API_KEY)
    }

@app.post("/api/resume/parse")
async def parse_resume_upload(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are currently supported for direct upload.")
    try:
        content = await file.read()
        extracted_text = parser_service.extract_text_from_pdf_bytes(content)
        return {
            "filename": file.filename,
            "text": extracted_text,
            "char_count": len(extracted_text)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/resume/analyze", response_model=ResumeAnalysisResponse)
def analyze_resume(req: ResumeAnalysisRequest):
    try:
        return analyzer_service.analyze_resume(req.resume_text, req.target_role or "Software Engineer")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/job/match", response_model=JobMatchResponse)
def match_job_description(req: JobMatchRequest):
    try:
        return analyzer_service.match_job(req.resume_text, req.job_description, req.job_title or "Target Job")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/roadmap/generate", response_model=RoadmapResponse)
def generate_roadmap(req: RoadmapRequest):
    try:
        return roadmap_service.generate_roadmap(
            target_role=req.target_role,
            current_skills=req.current_skills,
            missing_skills=req.missing_skills,
            duration_weeks=req.duration_weeks or 6
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/interview/start", response_model=InterviewStartResponse)
def start_interview(req: InterviewStartRequest):
    try:
        return interview_service.start_interview(
            target_role=req.target_role,
            resume_text=req.resume_text or "",
            job_description=req.job_description or "",
            interview_type=req.interview_type or "Mixed"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/interview/evaluate", response_model=InterviewEvaluateResponse)
def evaluate_interview_response(req: InterviewEvaluateRequest):
    try:
        return interview_service.evaluate_answer(
            question=req.question,
            question_type=req.question_type,
            user_answer=req.user_answer,
            target_role=req.target_role
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=True)
