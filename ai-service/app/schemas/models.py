from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ResumeAnalysisRequest(BaseModel):
    resume_text: str
    target_role: Optional[str] = "Software Engineer"

class ResumeAnalysisResponse(BaseModel):
    candidate_name: Optional[str] = "Candidate"
    target_role: str
    years_of_experience: Optional[float] = 0.0
    extracted_skills: List[str]
    soft_skills: List[str]
    experience_highlights: List[str]
    education: List[str]
    strengths: List[str]
    improvement_areas: List[str]
    score: int = Field(..., ge=0, le=100)
    summary: str

class JobMatchRequest(BaseModel):
    resume_text: str
    job_description: str
    job_title: Optional[str] = "Target Job"

class JobMatchResponse(BaseModel):
    match_percentage: int
    matching_skills: List[str]
    missing_critical_skills: List[str]
    nice_to_have_missing: List[str]
    experience_alignment: str
    recommendations: List[str]
    fit_summary: str

class RoadmapRequest(BaseModel):
    target_role: str
    current_skills: List[str]
    missing_skills: List[str]
    duration_weeks: Optional[int] = 6

class WeekTask(BaseModel):
    week_number: int
    title: str
    focus_topic: str
    skills_covered: List[str]
    tasks: List[str]
    recommended_resources: List[str]

class PortfolioProject(BaseModel):
    title: str
    description: str
    skills_highlighted: List[str]
    difficulty: str  # Beginner, Intermediate, Advanced
    deliverables: List[str]

class RoadmapResponse(BaseModel):
    target_role: str
    estimated_weeks: int
    weekly_breakdown: List[WeekTask]
    recommended_projects: List[PortfolioProject]
    career_advice: str

class InterviewStartRequest(BaseModel):
    target_role: str
    resume_text: Optional[str] = ""
    job_description: Optional[str] = ""
    interview_type: Optional[str] = "Mixed"  # Technical, Behavioral, Mixed

class InterviewQuestion(BaseModel):
    id: int
    question: str
    type: str  # Technical, Behavioral, Scenario
    focus_area: str
    guidance: str

class InterviewStartResponse(BaseModel):
    session_id: str
    target_role: str
    questions: List[InterviewQuestion]

class InterviewEvaluateRequest(BaseModel):
    question: str
    question_type: str
    user_answer: str
    target_role: str

class InterviewEvaluateResponse(BaseModel):
    score: int  # 0 to 100
    technical_accuracy: str
    communication_clarity: str
    positive_feedback: List[str]
    constructive_criticism: List[str]
    model_answer_example: str
