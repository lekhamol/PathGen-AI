import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import ResumeMatcher from './components/ResumeMatcher';
import RoadmapView from './components/RoadmapView';
import MockInterview from './components/MockInterview';
import ApplicationTracker from './components/ApplicationTracker';
import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Shared state across features
  const [analysisData, setAnalysisData] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [stats, setStats] = useState({
    totalApplications: 4,
    appliedCount: 2,
    interviewCount: 1,
    offerCount: 1,
    wishlistCount: 1,
    averageMatchScore: 84,
    totalRoadmapTasks: 12,
    completedRoadmapTasks: 7,
    roadmapProgressPercent: 58
  });

  // State transferred to Roadmap
  const [roadmapRole, setRoadmapRole] = useState("Full Stack Developer");
  const [roadmapCurrentSkills, setRoadmapCurrentSkills] = useState(["Python", "React", "JavaScript", "SQL", "Git"]);
  const [roadmapMissingSkills, setRoadmapMissingSkills] = useState(["Docker", "Kubernetes", "AWS Cloud", "CI/CD"]);

  // Fetch initial summary from backend if running
  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getDashboardSummary();
        if (data && !data.error) {
          setStats(prev => ({
            ...prev,
            ...data
          }));
        }
      } catch (err) {
        // Fallback already in place
      }
    }
    loadStats();
  }, []);

  const handleAnalysisComplete = (newAnalysis, newMatch) => {
    if (newAnalysis) setAnalysisData(newAnalysis);
    if (newMatch) setMatchData(newMatch);

    if (newMatch?.match_percentage) {
      setStats(prev => ({
        ...prev,
        averageMatchScore: Math.round((prev.averageMatchScore + newMatch.match_percentage) / 2)
      }));
    }
  };

  const handleNavigateToRoadmap = (targetRole, currentSkills, missingSkills) => {
    setRoadmapRole(targetRole);
    if (currentSkills?.length) setRoadmapCurrentSkills(currentSkills);
    if (missingSkills?.length) setRoadmapMissingSkills(missingSkills);
    setActiveTab('roadmap');
  };

  const handleTaskProgressUpdate = (completed, total) => {
    setStats(prev => ({
      ...prev,
      totalRoadmapTasks: total,
      completedRoadmapTasks: completed,
      roadmapProgressPercent: total > 0 ? Math.round((completed / total) * 100) : 0
    }));
  };

  const handleAppsUpdate = (apps) => {
    const applied = apps.filter(a => a.status === 'APPLIED').length;
    const interview = apps.filter(a => a.status === 'INTERVIEW').length;
    const offer = apps.filter(a => a.status === 'OFFER').length;
    const wishlist = apps.filter(a => a.status === 'WISHLIST').length;
    const avgMatch = apps.length > 0 
      ? Math.round(apps.reduce((sum, a) => sum + (a.matchPercentage || 0), 0) / apps.length)
      : 80;

    setStats(prev => ({
      ...prev,
      totalApplications: apps.length,
      appliedCount: applied,
      interviewCount: interview,
      offerCount: offer,
      wishlistCount: wishlist,
      averageMatchScore: avgMatch
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <Dashboard 
            stats={stats} 
            analysisData={analysisData} 
            setActiveTab={setActiveTab} 
          />
        )}

        {activeTab === 'matcher' && (
          <ResumeMatcher
            onAnalysisComplete={handleAnalysisComplete}
            onNavigateToRoadmap={handleNavigateToRoadmap}
          />
        )}

        {activeTab === 'roadmap' && (
          <RoadmapView
            initialRole={roadmapRole}
            initialCurrentSkills={roadmapCurrentSkills}
            initialMissingSkills={roadmapMissingSkills}
            onTaskProgressUpdate={handleTaskProgressUpdate}
          />
        )}

        {activeTab === 'interview' && (
          <MockInterview
            targetRole={roadmapRole || "Full Stack Developer"}
          />
        )}

        {activeTab === 'tracker' && (
          <ApplicationTracker
            onStatsUpdate={handleAppsUpdate}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">AI Career Copilot</span>
            <span>• Generative AI Based Career Guidance System</span>
          </div>
          <div>
            Built with React, Python FastAPI, Java Spring Boot & PostgreSQL
          </div>
        </div>
      </footer>
    </div>
  );
}
