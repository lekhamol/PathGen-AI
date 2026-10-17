import React, { useState } from 'react';
import { 
  BriefcaseBusiness, 
  Plus, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Search,
  Building2,
  MapPin,
  DollarSign
} from 'lucide-react';

const INITIAL_APPS = [
  {
    id: 1,
    companyName: "InnovateTech Systems",
    jobTitle: "Full Stack Engineer",
    location: "Remote / San Francisco",
    salaryRange: "$110k - $135k",
    status: "INTERVIEW",
    matchPercentage: 88,
    appliedDate: "2026-10-10",
    notes: "Round 2 technical architecture interview scheduled next Tuesday."
  },
  {
    id: 2,
    companyName: "Apex Cloud Labs",
    jobTitle: "Backend Software Engineer",
    location: "New York, NY",
    salaryRange: "$120k - $145k",
    status: "APPLIED",
    matchPercentage: 82,
    appliedDate: "2026-10-12",
    notes: "Submitted tailored resume highlighting FastAPI and PostgreSQL optimization."
  },
  {
    id: 3,
    companyName: "NextGen AI",
    jobTitle: "GenAI Application Developer",
    location: "Remote",
    salaryRange: "$130k - $160k",
    status: "WISHLIST",
    matchPercentage: 76,
    appliedDate: "2026-10-15",
    notes: "Reviewing required LangChain and Vector DB skills before applying."
  },
  {
    id: 4,
    companyName: "Starlight Digital",
    jobTitle: "Junior Platform Engineer",
    location: "Austin, TX",
    salaryRange: "$95k - $115k",
    status: "OFFER",
    matchPercentage: 91,
    appliedDate: "2026-09-28",
    notes: "Offer received! Negotiating sign-on bonus and remote flexibility."
  }
];

export default function ApplicationTracker({ onStatsUpdate }) {
  const [applications, setApplications] = useState(INITIAL_APPS);
  const [filter, setFilter] = useState("ALL");
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const [newApp, setNewApp] = useState({
    companyName: "",
    jobTitle: "",
    location: "",
    salaryRange: "",
    status: "APPLIED",
    matchPercentage: 80,
    notes: ""
  });

  const statuses = ["ALL", "WISHLIST", "APPLIED", "SCREENING", "INTERVIEW", "OFFER", "REJECTED"];

  const handleAddApplication = (e) => {
    e.preventDefault();
    if (!newApp.companyName || !newApp.jobTitle) return;

    const created = {
      ...newApp,
      id: Date.now(),
      appliedDate: new Date().toISOString().split('T')[0]
    };
    const updated = [created, ...applications];
    setApplications(updated);
    setShowAddModal(false);
    setNewApp({
      companyName: "",
      jobTitle: "",
      location: "",
      salaryRange: "",
      status: "APPLIED",
      matchPercentage: 80,
      notes: ""
    });

    if (onStatsUpdate) {
      onStatsUpdate(updated);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = applications.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    );
    setApplications(updated);
    if (onStatsUpdate) {
      onStatsUpdate(updated);
    }
  };

  const handleDelete = (id) => {
    const updated = applications.filter(app => app.id !== id);
    setApplications(updated);
    if (onStatsUpdate) {
      onStatsUpdate(updated);
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesFilter = filter === "ALL" || app.status === filter;
    const matchesSearch = app.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "OFFER":
        return "bg-emerald-100 text-emerald-800 border-emerald-200";
      case "INTERVIEW":
        return "bg-indigo-100 text-indigo-800 border-indigo-200";
      case "SCREENING":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "APPLIED":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "WISHLIST":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "REJECTED":
        return "bg-rose-100 text-rose-800 border-rose-200";
      default:
        return "bg-slate-100 text-slate-800 border-slate-200";
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <BriefcaseBusiness className="w-5 h-5 text-indigo-600" />
              Career Application Pipeline Tracker
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Organize target positions, record interview rounds, and monitor match percentages across opportunities.
            </p>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-sm shadow-indigo-200 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Application
          </button>
        </div>

        {/* Search & Filter Tabs */}
        <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 pt-2">
          {/* Status Tabs */}
          <div className="flex flex-wrap gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {statuses.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  filter === s 
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-200' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search role or company..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
      </div>

      {/* Applications Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredApps.map((app) => (
          <div
            key={app.id}
            className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{app.jobTitle}</h3>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>{app.companyName}</span>
                  </div>
                </div>

                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${getStatusBadge(app.status)}`}>
                  {app.status}
                </span>
              </div>

              {/* Meta details */}
              <div className="space-y-1 text-xs text-slate-500 pt-1">
                {app.location && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span>{app.location}</span>
                  </div>
                )}
                {app.salaryRange && (
                  <div className="flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    <span>{app.salaryRange}</span>
                  </div>
                )}
              </div>

              {/* Match Badge & Notes */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 text-xs">
                <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                  {app.matchPercentage}% JD Match
                </span>
                <span className="text-[11px] text-slate-400">
                  {app.appliedDate}
                </span>
              </div>

              {app.notes && (
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 leading-relaxed italic">
                  "{app.notes}"
                </p>
              )}
            </div>

            {/* Actions Bar */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <select
                value={app.status}
                onChange={(e) => handleStatusChange(app.id, e.target.value)}
                className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="WISHLIST">Wishlist</option>
                <option value="APPLIED">Applied</option>
                <option value="SCREENING">Screening</option>
                <option value="INTERVIEW">Interview</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
              </select>

              <button
                onClick={() => handleDelete(app.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                title="Delete Application"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredApps.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 space-y-2">
          <BriefcaseBusiness className="w-8 h-8 mx-auto text-slate-300" />
          <p className="text-sm font-semibold">No applications found in this view.</p>
          <p className="text-xs text-slate-400">Click "Add Application" to record a new position.</p>
        </div>
      )}

      {/* Modal to Add Application */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-scaleUp">
            <h2 className="text-base font-bold text-slate-900">Add New Career Application</h2>

            <form onSubmit={handleAddApplication} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Company Name</label>
                <input
                  type="text"
                  required
                  value={newApp.companyName}
                  onChange={(e) => setNewApp({ ...newApp, companyName: e.target.value })}
                  placeholder="e.g. Google, Stripe, Startup"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  value={newApp.jobTitle}
                  onChange={(e) => setNewApp({ ...newApp, jobTitle: e.target.value })}
                  placeholder="e.g. Full Stack Engineer"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Location</label>
                  <input
                    type="text"
                    value={newApp.location}
                    onChange={(e) => setNewApp({ ...newApp, location: e.target.value })}
                    placeholder="e.g. Remote / NYC"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Status</label>
                  <select
                    value={newApp.status}
                    onChange={(e) => setNewApp({ ...newApp, status: e.target.value })}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                  >
                    <option value="WISHLIST">Wishlist</option>
                    <option value="APPLIED">Applied</option>
                    <option value="SCREENING">Screening</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Estimated JD Match %</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={newApp.matchPercentage}
                  onChange={(e) => setNewApp({ ...newApp, matchPercentage: Number(e.target.value) })}
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-600 mb-1">Notes</label>
                <textarea
                  rows={3}
                  value={newApp.notes}
                  onChange={(e) => setNewApp({ ...newApp, notes: e.target.value })}
                  placeholder="Key recruiter contact or interview preparation notes..."
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-slate-50"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
