import React from 'react';
import { 
  TrendingUp, 
  CheckCircle2, 
  Send, 
  Calendar, 
  ArrowRight, 
  Award, 
  Zap, 
  Target,
  Sparkles,
  Mic
} from 'lucide-react';

export default function Dashboard({ 
  stats, 
  analysisData, 
  setActiveTab 
}) {
  const readiness = analysisData?.score || 78;
  const targetRole = analysisData?.target_role || "Full Stack Developer";

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-indigo-200 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            AI-Powered Career Intelligence
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Elevate Your Career Trajectory
          </h1>
          <p className="text-indigo-100 text-sm sm:text-base leading-relaxed">
            Targeting <span className="font-semibold text-amber-300">{targetRole}</span>. Compare your resume against top industry job descriptions, bridge critical gaps with weekly roadmaps, and practice with AI mock interviews.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('matcher')}
              className="inline-flex items-center gap-2 bg-indigo-500 hover:bg-indigo-400 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all shadow-lg shadow-indigo-500/25"
            >
              <Zap className="w-4 h-4" />
              Analyze New Resume
            </button>
            <button
              onClick={() => setActiveTab('interview')}
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-all border border-white/15"
            >
              Start AI Interview
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Decorative backdrop shapes */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none"></div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Readiness Meter */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Readiness Score</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{readiness}%</span>
            <span className="text-xs font-medium text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              Top 15%
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${readiness}%` }}
            ></div>
          </div>
        </div>

        {/* Average Match */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Avg Job Match</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Target className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{stats?.averageMatchScore || 82}%</span>
            <span className="text-xs text-slate-500">Across saved targets</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${stats?.averageMatchScore || 82}%` }}
            ></div>
          </div>
        </div>

        {/* Roadmap Tasks */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Roadmap Progress</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{stats?.roadmapProgressPercent || 60}%</span>
            <span className="text-xs text-slate-500">{stats?.completedRoadmapTasks || 6} / {stats?.totalRoadmapTasks || 10} tasks</span>
          </div>
          <div className="mt-3 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-amber-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${stats?.roadmapProgressPercent || 60}%` }}
            ></div>
          </div>
        </div>

        {/* Active Applications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Applications</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-xl">
              <Send className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900">{stats?.totalApplications || 4}</span>
            <span className="text-xs font-medium text-indigo-600">
              {stats?.interviewCount || 1} Interview scheduled
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Applied: {stats?.appliedCount || 2}</span>
            <span>Offers: {stats?.offerCount || 1}</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Identified Skills & Quick Action Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Skill Spectrum */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Extracted Technical Stack</h2>
              <p className="text-xs text-slate-500">Detected from your resume profile</p>
            </div>
            <button 
              onClick={() => setActiveTab('matcher')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
            >
              Update Skills <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {(analysisData?.extracted_skills || [
              "Python", "React", "JavaScript", "REST APIs", "Git", "SQL", "Tailwind CSS", "Docker"
            ]).map((skill, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h3 className="text-sm font-semibold text-slate-900 mb-2">Key Improvement Focus Areas</h3>
            <div className="space-y-2">
              {(analysisData?.improvement_areas || [
                "Deepen knowledge in containerization with Docker and Kubernetes pipelines.",
                "Implement end-to-end testing coverage using Jest/PyTest.",
                "Quantify business and performance impact metrics on key resume project bullet points."
              ]).map((area, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0"></div>
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Recommended Next Steps */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">Recommended Next Steps</h2>
            <p className="text-xs text-slate-500 mb-4">Curated steps to maximize your placement chances</p>

            <div className="space-y-3">
              <div 
                onClick={() => setActiveTab('interview')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 cursor-pointer transition-all flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-indigo-100 text-indigo-700">
                  <Mic className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-900">Run Mock Interview</div>
                  <div className="text-[11px] text-slate-500">Practice questions for {targetRole}</div>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('roadmap')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/50 cursor-pointer transition-all flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-amber-100 text-amber-700">
                  <Calendar className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-900">Check Week 2 Study Plan</div>
                  <div className="text-[11px] text-slate-500">Complete containerization tasks</div>
                </div>
              </div>

              <div 
                onClick={() => setActiveTab('tracker')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-purple-300 hover:bg-purple-50/50 cursor-pointer transition-all flex items-center gap-3"
              >
                <div className="p-2 rounded-lg bg-purple-100 text-purple-700">
                  <Send className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="text-xs font-semibold text-slate-900">Track 2 Applications</div>
                  <div className="text-[11px] text-slate-500">Follow up on screening status</div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-slate-400">All data continuously synced across services</span>
          </div>
        </div>
      </div>
    </div>
  );
}
