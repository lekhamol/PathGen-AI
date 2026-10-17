import React, { useState } from 'react';
import { 
  Mic, 
  Send, 
  Sparkles, 
  CheckCircle, 
  AlertCircle, 
  Award, 
  HelpCircle, 
  Loader2, 
  ArrowRight, 
  RefreshCw,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { api } from '../services/api';

export default function MockInterview({ targetRole = "Full Stack Engineer" }) {
  const [role, setRole] = useState(targetRole);
  const [interviewType, setInterviewType] = useState("Mixed"); // Technical, Behavioral, Mixed
  const [sessionActive, setSessionActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluations, setEvaluations] = useState({});

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const data = await api.startInterview(role, "", "", interviewType);
      if (data?.questions?.length > 0) {
        setQuestions(data.questions);
        setCurrentIdx(0);
        setUserAnswer("");
        setEvaluations({});
        setSessionActive(true);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to start mock interview: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!userAnswer.trim()) {
      alert("Please provide an answer before submitting for evaluation.");
      return;
    }

    setEvaluating(true);
    const currQuestion = questions[currentIdx];
    try {
      const evalData = await api.evaluateInterviewAnswer(
        currQuestion.question,
        currQuestion.type,
        userAnswer,
        role
      );
      setEvaluations(prev => ({
        ...prev,
        [currentIdx]: evalData
      }));
    } catch (err) {
      console.error(err);
      alert("Evaluation failed: " + err.message);
    } finally {
      setEvaluating(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setUserAnswer("");
    }
  };

  const handleQuickAnswerSample = () => {
    const q = questions[currentIdx];
    if (q.type === 'Technical') {
      setUserAnswer("In my previous project, we optimized our database queries by adding composite B-tree indexes on foreign keys and user IDs. We also placed a Redis caching layer in front of our high-traffic profile endpoints, reducing p99 latency from 450ms down to 65ms under simulated peak load.");
    } else {
      setUserAnswer("In my last role (Situation), our team faced a tight 3-week deadline to deliver a new client dashboard (Task). I prioritized the core MVP user flows and coordinated daily 15-minute syncs with backend and frontend teammates to clarify API contracts (Action). We deployed the release two days ahead of schedule with zero major production bugs (Result).");
    }
  };

  const currentQ = questions[currentIdx];
  const currentEval = evaluations[currentIdx];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Mic className="w-5 h-5 text-indigo-600" />
              AI-Powered Mock Interview Simulator
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Test technical depth and behavioral STAR delivery with personalized AI questions and immediate feedback.
            </p>
          </div>

          {!sessionActive ? (
            <button
              onClick={handleStartInterview}
              disabled={loading}
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm shadow-indigo-200 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              Start Interview Session
            </button>
          ) : (
            <button
              onClick={() => setSessionActive(false)}
              className="inline-flex items-center gap-2 border border-slate-200 hover:bg-slate-100 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Session
            </button>
          )}
        </div>

        {/* Configuration inputs if not yet started */}
        {!sessionActive && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Target Position</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Interview Style</label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
              >
                <option value="Mixed">Mixed (Technical & Behavioral)</option>
                <option value="Technical">Technical Deep Dive</option>
                <option value="Behavioral">Behavioral & Leadership (STAR)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Active Question & Answer Stage */}
      {sessionActive && currentQ && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Question & Answer Box (2 Cols) */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            {/* Question Progress & Category */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                Question {currentIdx + 1} of {questions.length}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                currentQ.type === 'Technical' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-purple-100 text-purple-800'
              }`}>
                {currentQ.type} • {currentQ.focus_area}
              </span>
            </div>

            {/* Prompt Statement */}
            <div className="space-y-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                {currentQ.question}
              </h2>
              {currentQ.guidance && (
                <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100/80 text-xs text-indigo-900 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <span><strong>Interviewer Tip:</strong> {currentQ.guidance}</span>
                </div>
              )}
            </div>

            {/* Answer Input */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Your Answer
                </label>
                <button
                  type="button"
                  onClick={handleQuickAnswerSample}
                  className="text-[11px] font-medium text-indigo-600 hover:text-indigo-800 underline"
                >
                  Insert Sample Response
                </button>
              </div>

              <textarea
                rows={7}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Structure your answer clearly. Mention technical tools, architectural trade-offs, or the STAR methodology..."
                className="w-full text-xs p-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
              />
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleEvaluateAnswer}
                disabled={evaluating || !userAnswer.trim()}
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-xs font-semibold shadow-sm shadow-indigo-200 transition-all disabled:opacity-50"
              >
                {evaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                Submit for AI Feedback
              </button>

              {currentIdx < questions.length - 1 && (
                <button
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-xl text-xs font-semibold transition-all"
                >
                  Next Question
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* AI Feedback Panel (Right Column) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-600" />
              Live Evaluation Report
            </h3>

            {currentEval ? (
              <div className="space-y-4 animate-fadeIn">
                {/* Score Dial */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-900">Score</span>
                  <span className="text-3xl font-extrabold text-indigo-600">{currentEval.score}/100</span>
                </div>

                {/* Accuracy */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Technical Depth:</span>
                  <p className="text-xs text-slate-600">{currentEval.technical_accuracy}</p>
                </div>

                {/* Clarity */}
                <div className="space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">Clarity & Structure:</span>
                  <p className="text-xs text-slate-600">{currentEval.communication_clarity}</p>
                </div>

                {/* Strengths */}
                {currentEval.positive_feedback?.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Strengths
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {currentEval.positive_feedback.map((st, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-500 font-bold">•</span>
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Improvement */}
                {currentEval.constructive_criticism?.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Areas to Refine
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {currentEval.constructive_criticism.map((cr, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>{cr}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Model Answer Preview */}
                {currentEval.model_answer_example && (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                      Model Answer Benchmark
                    </span>
                    <p className="text-[11px] text-slate-600 leading-relaxed italic">
                      "{currentEval.model_answer_example}"
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-200 rounded-xl text-slate-400 space-y-2">
                <Sparkles className="w-8 h-8 text-slate-300" />
                <p className="text-xs">Provide your answer and click <strong>Submit for AI Feedback</strong> to receive real-time scores and suggestions.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
