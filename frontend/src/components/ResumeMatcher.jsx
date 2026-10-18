import React, { useState } from 'react';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  ArrowRight, 
  Loader2,
  BookmarkCheck,
  Zap,
  Info
} from 'lucide-react';
import { api } from '../services/api';

const SAMPLE_RESUME = `Alex Morgan
alex.morgan@email.com | +1 (555) 019-2834 | San Francisco, CA | github.com/alexmorgan

SUMMARY
Energetic software developer with 2 years of practical experience building responsive web applications using React, JavaScript, and Python. Passionate about clean UI/UX, REST APIs, and modern development best practices.

TECHNICAL SKILLS
Languages: Python, JavaScript, HTML5, CSS3, SQL
Frameworks & Libraries: React, Express, FastAPI, Tailwind CSS, Bootstrap
Databases & Tools: PostgreSQL, SQLite, Git, GitHub, Postman, Linux

WORK EXPERIENCE
Software Developer Intern | CloudTech Solutions (2023 - Present)
- Developed responsive front-end components using React and Tailwind CSS, increasing page load speed by 25%.
- Implemented RESTful API endpoints in Python FastAPI to support user authentication and profile data querying.
- Wrote unit tests for key backend modules, increasing code coverage to 75%.
- Participated in weekly Agile sprint planning, daily standups, and peer code reviews.

EDUCATION
B.S. in Computer Science | State University (2020 - 2024)`;

const SAMPLE_JD = `Role: Full Stack Engineer
Company: InnovateTech Systems

About the Role:
We are looking for a skilled Full Stack Engineer to join our core engineering team. You will build and scale distributed cloud applications, integrate modern generative AI features, and maintain high code quality standards.

Requirements:
- 1-3 years of experience with React, TypeScript, or modern JavaScript frameworks.
- Strong proficiency in Python or Java backend services.
- Hands-on experience with Docker, containerization, and AWS or GCP cloud deployments.
- Solid understanding of PostgreSQL or MySQL, relational schema design, and query optimization.
- Familiarity with CI/CD pipelines (GitHub Actions) and Microservices architecture is a plus.
- Excellent communication and collaborative problem-solving skills.`;

export default function ResumeMatcher({ 
  onAnalysisComplete, 
  onNavigateToRoadmap 
}) {
  const [resumeText, setResumeText] = useState(SAMPLE_RESUME);
  const [jobDescription, setJobDescription] = useState(SAMPLE_JD);
  const [targetRole, setTargetRole] = useState("Full Stack Engineer");
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [matchResult, setMatchResult] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('match'); // 'match' or 'resume'

  // Handle PDF file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setUploadError(null);
    try {
      const data = await api.parsePdf(file);
      if (data?.text) {
        setResumeText(data.text);
      } else {
        setUploadError("PDF parsed but no text was extracted. The file may be scanned/image-based. Please paste your resume text manually.");
      }
    } catch (err) {
      setUploadError(err.message || "Failed to upload PDF. You can paste your resume text below instead.");
    } finally {
      setUploadLoading(false);
      // Reset file input so same file can be re-uploaded
      e.target.value = '';
    }
  };

  // Run Match & Gap Analysis
  const handleRunAnalysis = async () => {
    if (!resumeText.trim()) {
      alert("Please enter or upload your resume.");
      return;
    }
    setLoading(true);
    try {
      const [analysisData, matchData] = await Promise.all([
        api.analyzeResume(resumeText, targetRole),
        jobDescription.trim() ? api.matchJob(resumeText, jobDescription, targetRole) : null
      ]);

      setAnalysisResult(analysisData);
      setMatchResult(matchData);
      if (onAnalysisComplete) {
        onAnalysisComplete(analysisData, matchData);
      }
    } catch (err) {
      console.error(err);
      alert("Analysis error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-600" />
            Resume Analyzer & Job Description Matcher
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Compare candidate qualifications with job requirements to highlight strengths and identify missing skills.
          </p>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <input
            type="text"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="Target Role"
            className="text-xs font-medium px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50 flex-1 sm:w-48"
          />
          <button
            onClick={handleRunAnalysis}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-semibold shadow-sm shadow-indigo-200 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Analyze Match
          </button>
        </div>
      </div>

      {/* Input Side: Resume Text / Upload + Job Description */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Resume Input Panel */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <FileText className="w-4 h-4 text-indigo-600" />
              Candidate Resume
            </label>
            <div className="flex items-center gap-2">
              <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                {uploadLoading ? "Uploading..." : "Upload PDF"}
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <button
                type="button"
                onClick={() => setResumeText(SAMPLE_RESUME)}
                className="text-[11px] font-medium text-slate-500 hover:text-indigo-600 underline"
              >
                Reset Sample
              </button>
            </div>
          </div>

          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            rows={10}
            placeholder="Paste your full resume here or upload a PDF..."
            className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y leading-relaxed text-slate-800"
          />

          {/* Inline upload error banner */}
          {uploadError && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0 text-rose-500" />
              <div>
                <span className="font-semibold">Upload failed: </span>
                {uploadError}
              </div>
              <button
                onClick={() => setUploadError(null)}
                className="ml-auto text-rose-400 hover:text-rose-600 font-bold text-base leading-none"
                title="Dismiss"
              >×</button>
            </div>
          )}
        </div>

        {/* Job Description Panel */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              Target Job Description (JD)
            </label>
            <button
              type="button"
              onClick={() => setJobDescription(SAMPLE_JD)}
              className="text-[11px] font-medium text-slate-500 hover:text-purple-600 underline"
            >
              Load Sample JD
            </button>
          </div>

          <textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={10}
            placeholder="Paste the target job description or requirements here..."
            className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-y leading-relaxed text-slate-800"
          />
        </div>
      </div>

      {/* Analysis Results Display */}
      {(matchResult || analysisResult) && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Analysis & Compatibility Results</h2>
              <p className="text-xs text-slate-500">Evaluated against {targetRole}</p>
            </div>

            {matchResult?.missing_critical_skills?.length > 0 && (
              <button
                onClick={() => onNavigateToRoadmap(targetRole, analysisResult?.extracted_skills || [], matchResult.missing_critical_skills)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500 to-indigo-600 text-white shadow-md shadow-indigo-100 hover:opacity-95 transition-all"
              >
                <Zap className="w-4 h-4" />
                Generate Roadmap for {matchResult.missing_critical_skills.length} Missing Skills
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Key Score Dial & Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Match Percentage */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/70 to-purple-50/50 border border-indigo-100 flex flex-col justify-center items-center text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">Role Match Score</span>
              <div className="my-2 relative flex items-center justify-center">
                <span className="text-5xl font-extrabold text-indigo-900">
                  {matchResult?.match_percentage || analysisResult?.score || 80}%
                </span>
              </div>
              <p className="text-xs text-indigo-600/90 font-medium">
                {matchResult?.match_percentage > 75 ? "Strong Candidate Match" : "Moderate Alignment - Upskilling Recommended"}
              </p>
            </div>

            {/* Matching Strengths */}
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Matched Strengths ({matchResult?.matching_skills?.length || analysisResult?.extracted_skills?.length || 0})
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                {(matchResult?.matching_skills || analysisResult?.extracted_skills || []).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-emerald-100/80 text-emerald-800"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Critical Gaps */}
            <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-3">
              <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                Missing Qualifications ({matchResult?.missing_critical_skills?.length || 0})
              </div>
              <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                {(matchResult?.missing_critical_skills || ["Docker", "Kubernetes", "Cloud Deployment"]).map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-md text-xs font-semibold bg-rose-100/80 text-rose-800"
                  >
                    ✕ {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Alignment & Recommendations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-600" />
                Experience & Fit Analysis
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                {matchResult?.fit_summary || analysisResult?.summary || "Profile shows strong foundations in modern web frameworks. Closing identified gaps in cloud deployment will significantly strengthen competitive standing."}
              </p>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <BookmarkCheck className="w-4 h-4 text-indigo-600" />
                Actionable Resume Improvements
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {(matchResult?.recommendations || analysisResult?.improvement_areas || [
                  "Add concrete performance metrics (latency, user counts) to project descriptions.",
                  "Create a sample deployment project utilizing Docker and continuous integration."
                ]).map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
