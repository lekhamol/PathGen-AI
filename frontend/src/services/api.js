const SPRING_BASE_URL = 'http://localhost:8080/api/v1/career';
const PYTHON_BASE_URL = 'http://localhost:8000/api';

/**
 * Intelligent fetch wrapper with backend failover
 */
async function postData(endpointPath, payload, pythonFallbackPath) {
  try {
    // Attempt Spring Boot first
    const springResponse = await fetch(`${SPRING_BASE_URL}${endpointPath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (springResponse.ok) {
      return await springResponse.json();
    }
  } catch (err) {
    console.warn(`Spring Boot unavailable at ${endpointPath}, attempting direct Python AI service...`);
  }

  // Attempt Python AI service directly
  if (pythonFallbackPath) {
    try {
      const pythonResponse = await fetch(`${PYTHON_BASE_URL}${pythonFallbackPath}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (pythonResponse.ok) {
        return await pythonResponse.json();
      }
    } catch (pyErr) {
      console.warn(`Python AI service unavailable at ${pythonFallbackPath}:`, pyErr);
    }
  }

  throw new Error("Unable to connect to backend or AI service. Please ensure services are running.");
}

export const api = {
  // Parse PDF resume file
  parsePdf: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch(`${PYTHON_BASE_URL}/resume/parse`, {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Failed to parse PDF file');
    return await response.json();
  },

  // Analyze Resume
  analyzeResume: async (resumeText, targetRole) => {
    return await postData('/resume/analyze', { resume_text: resumeText, target_role: targetRole }, '/resume/analyze');
  },

  // Match Job Description
  matchJob: async (resumeText, jobDescription, jobTitle) => {
    return await postData('/job/match', {
      resume_text: resumeText,
      job_description: jobDescription,
      job_title: jobTitle
    }, '/job/match');
  },

  // Generate Learning Roadmap
  generateRoadmap: async (targetRole, currentSkills, missingSkills, durationWeeks = 6) => {
    return await postData('/roadmap/generate', {
      target_role: targetRole,
      current_skills: currentSkills,
      missing_skills: missingSkills,
      duration_weeks: durationWeeks
    }, '/roadmap/generate');
  },

  // Start Mock Interview
  startInterview: async (targetRole, resumeText = '', jobDescription = '', interviewType = 'Mixed') => {
    return await postData('/interview/start', {
      target_role: targetRole,
      resume_text: resumeText,
      job_description: jobDescription,
      interview_type: interviewType
    }, '/interview/start');
  },

  // Evaluate Interview Answer
  evaluateInterviewAnswer: async (question, questionType, userAnswer, targetRole) => {
    return await postData('/interview/evaluate', {
      question,
      question_type: questionType,
      user_answer: userAnswer,
      target_role: targetRole
    }, '/interview/evaluate');
  },

  // Dashboard Stats
  getDashboardSummary: async () => {
    try {
      const res = await fetch(`${SPRING_BASE_URL}/dashboard`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Dashboard summary fallback');
    }
    return null;
  },

  // Job Applications
  getApplications: async () => {
    try {
      const res = await fetch(`${SPRING_BASE_URL}/applications`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Applications fallback');
    }
    return null;
  },

  createApplication: async (appData) => {
    const res = await fetch(`${SPRING_BASE_URL}/applications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appData)
    });
    return await res.json();
  },

  updateApplicationStatus: async (id, status) => {
    const res = await fetch(`${SPRING_BASE_URL}/applications/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    return await res.json();
  },

  deleteApplication: async (id) => {
    const res = await fetch(`${SPRING_BASE_URL}/applications/${id}`, {
      method: 'DELETE'
    });
    return res.ok;
  }
};
