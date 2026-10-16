from typing import List
from app.services.llm_service import llm_service
from app.schemas.models import RoadmapResponse, WeekTask, PortfolioProject

class RoadmapService:
    @staticmethod
    def generate_roadmap(target_role: str, current_skills: List[str], missing_skills: List[str], duration_weeks: int = 6) -> RoadmapResponse:
        system_instruction = (
            "You are a Senior Staff Engineer and Career Mentor. Generate a structured weekly learning roadmap "
            "and portfolio project recommendations to bridge missing technical skills for the specified target role."
        )
        prompt = f"""
        Target Role: {target_role}
        Current Skills: {', '.join(current_skills)}
        Missing / Target Skills: {', '.join(missing_skills)}
        Duration: {duration_weeks} weeks

        Generate JSON matching this exact structure:
        {{
            "target_role": "{target_role}",
            "estimated_weeks": {duration_weeks},
            "weekly_breakdown": [
                {{
                    "week_number": 1,
                    "title": "Core Foundations & Architectural Setup",
                    "focus_topic": "Foundational deep dive into {missing_skills[0] if missing_skills else 'Advanced Topics'}",
                    "skills_covered": ["SkillA", "SkillB"],
                    "tasks": ["Task 1 description", "Task 2 description"],
                    "recommended_resources": ["Official Documentation", "Interactive Tutorial"]
                }}
            ],
            "recommended_projects": [
                {{
                    "title": "Full-Stack Enterprise Application",
                    "description": "Build an end-to-end resilient microservice with JWT auth and database persistence.",
                    "skills_highlighted": ["Skill1", "Skill2"],
                    "difficulty": "Intermediate",
                    "deliverables": ["GitHub repository with CI/CD", "Live cloud deployment URL"]
                }}
            ],
            "career_advice": "Consistency is key. Focus on delivering production-quality project code with tests."
        }}
        """

        llm_result = llm_service.generate_json_response(prompt, system_instruction)
        if llm_result:
            try:
                return RoadmapResponse(**llm_result)
            except Exception:
                pass

        # Intelligent Heuristic Roadmap
        weekly_breakdown = []
        key_missing = missing_skills if missing_skills else ["Microservices", "Docker", "Cloud Deployment", "Database Indexing"]
        
        for w in range(1, duration_weeks + 1):
            topic_index = (w - 1) % len(key_missing)
            curr_topic = key_missing[topic_index]
            weekly_breakdown.append(
                WeekTask(
                    week_number=w,
                    title=f"Week {w}: Mastery of {curr_topic}",
                    focus_topic=f"Hands-on architectural patterns and implementation of {curr_topic}",
                    skills_covered=[curr_topic, "Best Practices", "Testing"],
                    tasks=[
                        f"Read official documentation and architectural guides on {curr_topic}",
                        f"Build a standalone prototype utilizing {curr_topic} in a clean architecture",
                        f"Implement unit and integration tests covering core business workflows",
                        "Commit code to GitHub with detailed README and architecture diagram"
                    ],
                    recommended_resources=[
                        f"{curr_topic} Official Documentation & Guides",
                        "GitHub Open-Source Reference Repositories",
                        "System Design Primer / Architectural Case Studies"
                    ]
                )
            )

        recommended_projects = [
            PortfolioProject(
                title=f"Production-Ready {target_role} Showcase Platform",
                description=f"A complete real-world system combining {', '.join(current_skills[:3])} and {', '.join(key_missing[:2])} with authentication, automated CI/CD, and monitoring.",
                skills_highlighted=(current_skills[:2] + key_missing[:2]),
                difficulty="Intermediate",
                deliverables=[
                    "Documented RESTful / GraphQL API endpoints",
                    "Containerized setup with Docker & Docker Compose",
                    "Automated GitHub Actions pipeline"
                ]
            ),
            PortfolioProject(
                title="High-Throughput Analytics & Event Streaming Dashboard",
                description="Real-time data processing pipeline featuring asynchronous workers, caching layers, and responsive interactive metrics.",
                skills_highlighted=["Caching / Redis", "Asynchronous Processing", "System Design"],
                difficulty="Advanced",
                deliverables=[
                    "Benchmarking reports proving low latency",
                    "Modular database schema migration scripts"
                ]
            )
        ]

        return RoadmapResponse(
            target_role=target_role,
            estimated_weeks=duration_weeks,
            weekly_breakdown=weekly_breakdown,
            recommended_projects=recommended_projects,
            career_advice=f"Prioritize depth over breadth. Building one well-documented, test-covered project highlighting {key_missing[0] if key_missing else 'core technologies'} will impress hiring managers far more than multiple superficial demos."
        )

roadmap_service = RoadmapService()
