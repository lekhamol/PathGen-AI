import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Calendar, 
  CheckCircle2, 
  Circle, 
  FolderGit2, 
  Sparkles, 
  BookOpen, 
  Loader2, 
  Clock,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { api } from '../services/api';

export default function RoadmapView({ 
  initialRole, 
  initialCurrentSkills, 
  initialMissingSkills,
  onTaskProgressUpdate
}) {
  const [role, setRole] = useState(initialRole || "Full Stack Developer");
  const [currentSkills, setCurrentSkills] = useState(initialCurrentSkills?.join(', ') || "Python, React, JavaScript, SQL, Git");
  const [missingSkills, setMissingSkills] = useState(initialMissingSkills?.join(', ') || "Docker, Kubernetes, AWS, CI/CD");
  const [durationWeeks, setDurationWeeks] = useState(6);
  const [loading, setLoading] = useState(false);
  const [roadmap, setRoadmap] = useState(null);
  const [expandedWeeks, setExpandedWeeks] = useState({});
  const [completedTasks, setCompletedTasks] = useState({});

  useEffect(() => {
    if (initialRole) setRole(initialRole);
    if (initialCurrentSkills?.length) setCurrentSkills(initialCurrentSkills.join(', '));
    if (initialMissingSkills?.length) setMissingSkills(initialMissingSkills.join(', '));
  }, [initialRole, initialCurrentSkills, initialMissingSkills]);

  // Generate roadmap on initial load if empty
  useEffect(() => {
    if (!roadmap) {
      handleGenerateRoadmap();
    }
  }, []);

  const handleGenerateRoadmap = async () => {
    setLoading(true);
    try {
      const curList = currentSkills.split(',').map(s => s.trim()).filter(Boolean);
      const misList = missingSkills.split(',').map(s => s.trim()).filter(Boolean);
      const data = await api.generateRoadmap(role, curList, misList, Number(durationWeeks));
      setRoadmap(data);
      // Expand the first two weeks by default
      setExpandedWeeks({ 1: true, 2: true });
    } catch (err) {
      console.error(err);
      alert("Failed to generate roadmap: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleWeek = (weekNum) => {
    setExpandedWeeks(prev => ({ ...prev, [weekNum]: !prev[weekNum] }));
  };

  const toggleTask = (taskKey) => {
    setCompletedTasks(prev => {
      const updated = { ...prev, [taskKey]: !prev[taskKey] };
      if (onTaskProgressUpdate) {
        const total = roadmap?.weekly_breakdown?.reduce((acc, w) => acc + w.tasks.length, 0) || 1;
        const count = Object.values(updated).filter(Boolean).length;
        onTaskProgressUpdate(count, total);
      }
      return updated;
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              Adaptive Learning Roadmap & Projects
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Customized study plans and portfolio project blueprints generated to close your specific skill gaps.
            </p>
          </div>

          <button
            onClick={handleGenerateRoadmap}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm shadow-indigo-200 transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            Generate New Roadmap
          </button>
        </div>

        {/* Configuration inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Target Role</label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Missing / Gap Skills</label>
            <input
              type="text"
              value={missingSkills}
              onChange={(e) => setMissingSkills(e.target.value)}
              placeholder="e.g. Docker, AWS, System Design"
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Duration (Weeks)</label>
            <select
              value={durationWeeks}
              onChange={(e) => setDurationWeeks(e.target.value)}
              className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
            >
              <option value={4}>4 Weeks (Intensive Sprint)</option>
              <option value={6}>6 Weeks (Balanced Track)</option>
              <option value={8}>8 Weeks (Comprehensive Mastery)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Career Mentor Advice Callout */}
      {roadmap?.career_advice && (
        <div className="bg-gradient-to-r from-amber-50 to-indigo-50 border border-amber-200/60 p-4 rounded-xl flex items-start gap-3">
          <div className="p-2 bg-amber-100 text-amber-800 rounded-lg flex-shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span className="text-xs font-bold text-amber-900 block">Senior Mentor Strategy</span>
            <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">{roadmap.career_advice}</p>
          </div>
        </div>
      )}

      {/* Main Content: Timeline + Portfolio Projects */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Timeline Breakdown (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600" />
            Weekly Study Plan ({roadmap?.weekly_breakdown?.length || 0} Weeks)
          </h2>

          <div className="space-y-3">
            {roadmap?.weekly_breakdown?.map((week) => {
              const isExpanded = expandedWeeks[week.week_number];
              const weekTaskKeys = week.tasks.map((_, i) => `${week.week_number}-${i}`);
              const completedInWeek = weekTaskKeys.filter(k => completedTasks[k]).length;
              const allDone = completedInWeek === week.tasks.length && week.tasks.length > 0;

              return (
                <div
                  key={week.week_number}
                  className={`bg-white rounded-2xl border transition-all ${
                    allDone ? 'border-emerald-200 bg-emerald-50/20' : 'border-slate-200'
                  } shadow-sm overflow-hidden`}
                >
                  {/* Header Row */}
                  <div
                    onClick={() => toggleWeek(week.week_number)}
                    className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                        allDone 
                          ? 'bg-emerald-600 text-white' 
                          : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                      }`}>
                        W{week.week_number}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{week.title}</h3>
                        <p className="text-xs text-slate-500">{week.focus_topic}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium text-slate-500">
                        {completedInWeek}/{week.tasks.length} Done
                      </span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 space-y-4">
                      {/* Skills Covered Pills */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {week.skills_covered?.map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      {/* Tasks Checklist */}
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-slate-700 block">Action Checklist:</span>
                        {week.tasks.map((task, idx) => {
                          const taskKey = `${week.week_number}-${idx}`;
                          const isDone = Boolean(completedTasks[taskKey]);
                          return (
                            <div
                              key={idx}
                              onClick={() => toggleTask(taskKey)}
                              className={`flex items-start gap-2.5 p-2 rounded-lg cursor-pointer transition-colors text-xs ${
                                isDone ? 'bg-emerald-50 text-slate-500 line-through' : 'hover:bg-slate-50 text-slate-700'
                              }`}
                            >
                              {isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-300 flex-shrink-0 mt-0.5 hover:text-indigo-600" />
                              )}
                              <span>{task}</span>
                            </div>
                          );
                        })}
                      </div>

                      {/* Recommended Resources */}
                      {week.recommended_resources?.length > 0 && (
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1.5">
                          <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                            Curated Resources
                          </span>
                          <ul className="text-xs text-slate-600 space-y-1">
                            {week.recommended_resources.map((res, rIdx) => (
                              <li key={rIdx} className="flex items-center gap-1.5">
                                <span className="text-indigo-500">→</span>
                                <span>{res}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Portfolio Project Recommendations (Right Column) */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-indigo-600" />
            Recommended Portfolio Projects
          </h2>

          <div className="space-y-4">
            {roadmap?.recommended_projects?.map((proj, pIdx) => (
              <div
                key={pIdx}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 hover:border-indigo-200 transition-colors"
              >
                <div className="flex justify-between items-start gap-2">
                  <h3 className="text-sm font-bold text-slate-900">{proj.title}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    proj.difficulty === 'Advanced'
                      ? 'bg-purple-100 text-purple-700'
                      : proj.difficulty === 'Intermediate'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {proj.difficulty}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{proj.description}</p>

                {/* Skills highlighted */}
                <div className="flex flex-wrap gap-1">
                  {proj.skills_highlighted?.map((sk, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700"
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Deliverables */}
                {proj.deliverables?.length > 0 && (
                  <div className="border-t border-slate-100 pt-3 space-y-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                      Target Deliverables:
                    </span>
                    <ul className="text-xs text-slate-600 space-y-1">
                      {proj.deliverables.map((deliv, dIdx) => (
                        <li key={dIdx} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 mt-0.5 flex-shrink-0" />
                          <span>{deliv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
