import React, { useState, useMemo } from 'react';
import { 
  Map, 
  CheckCircle2, 
  CircleDashed, 
  Clock, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  RotateCcw, 
  Sliders, 
  X, 
  GraduationCap, 
  Layers, 
  Compass, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Check, 
  ToggleLeft, 
  ToggleRight,
  BookOpen,
  Code2,
  FolderGit2,
  AlertTriangle,
  Lightbulb,
  ListOrdered
} from 'lucide-react';
import { MemoryItem, MilestoneStatus, RoadmapMilestone } from '../types';
import { 
  generatePersonalizedRoadmap, 
  loadRoadmapStatusOverrides, 
  saveRoadmapStatusOverrides,
  clearRoadmapStatusOverrides,
  loadProgressTrackingEnabled,
  saveProgressTrackingEnabled,
  RoadmapCustomization
} from '../utils/roadmapGenerator';

interface RoadmapViewProps {
  memories: MemoryItem[];
  onStartChatWithTopic: (topic: string) => void;
}

const CUSTOMIZATION_STORAGE_KEY = 'nextpath_roadmap_customization';

function loadStoredCustomization(): RoadmapCustomization {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(CUSTOMIZATION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredCustomization(customization: RoadmapCustomization): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CUSTOMIZATION_STORAGE_KEY, JSON.stringify(customization));
  } catch {
    // Ignore storage errors
  }
}

export const RoadmapView: React.FC<RoadmapViewProps> = ({ memories, onStartChatWithTopic }) => {
  const [customization, setCustomization] = useState<RoadmapCustomization>(loadStoredCustomization);
  const [statusOverrides, setStatusOverrides] = useState<Record<string, MilestoneStatus>>(loadRoadmapStatusOverrides);
  const [filter, setFilter] = useState<'All' | 'Completed' | 'In Progress' | 'Upcoming'>('All');
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  // Optional manual progress tracking (OFF by default)
  const [isTrackingEnabled, setIsTrackingEnabled] = useState<boolean>(loadProgressTrackingEnabled);

  // Expanded stage cards for detailed Learn & Practice guidance (default first stage open)
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({ 's-1': true });

  // Customizer form state
  const [customRole, setCustomRole] = useState(customization.targetRole || 'Software Developer');
  const [customWeeklyHours, setCustomWeeklyHours] = useState(customization.weeklyHours || '15 Hours / Week');

  // Dynamic roadmap generation based on current student memories & customizations
  const milestones = useMemo(() => {
    return generatePersonalizedRoadmap(memories, customization, statusOverrides);
  }, [memories, customization, statusOverrides]);

  // Key student profile stats extracted from real My Memory
  const studentEducation = useMemo(() => {
    const edu = memories.find((m) => m.category === 'Education');
    return edu ? edu.value : null;
  }, [memories]);

  const familiarSkillsList = useMemo(() => {
    return memories
      .filter((m) => m.category === 'Skills')
      .map((m) => m.value)
      .join(', ')
      .split(/[,;\/]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }, [memories]);

  const targetGoal = useMemo(() => {
    const goal = memories.find((m) => m.category === 'Goals');
    return customization.targetRole || (goal ? goal.value : 'Software Developer');
  }, [memories, customization.targetRole]);

  // Progress metrics (only relevant when tracking is enabled)
  const totalCount = milestones.length;
  const completedCount = milestones.filter((m) => m.status === 'Completed').length;
  const inProgressCount = milestones.filter((m) => m.status === 'In Progress').length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const toggleStageDetails = (stageId: string) => {
    setExpandedStages((prev) => ({
      ...prev,
      [stageId]: !prev[stageId],
    }));
  };

  const handleToggleTracking = () => {
    const nextVal = !isTrackingEnabled;
    setIsTrackingEnabled(nextVal);
    saveProgressTrackingEnabled(nextVal);
  };

  const handleUpdateStatus = (id: string, newStatus: MilestoneStatus) => {
    const updated = { ...statusOverrides, [id]: newStatus };
    setStatusOverrides(updated);
    saveRoadmapStatusOverrides(updated);
  };

  const handleToggleComplete = (id: string) => {
    const currentM = milestones.find((m) => m.id === id);
    if (!currentM) return;
    const nextStatus: MilestoneStatus = currentM.status === 'Completed' ? 'In Progress' : 'Completed';
    handleUpdateStatus(id, nextStatus);
  };

  const handleResetRoadmap = () => {
    clearRoadmapStatusOverrides();
    setStatusOverrides({});
    localStorage.removeItem(CUSTOMIZATION_STORAGE_KEY);
    setCustomization({});
    setCustomRole('Software Developer');
    setCustomWeeklyHours('15 Hours / Week');
  };

  const handleApplyCustomization = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: RoadmapCustomization = {
      targetRole: customRole,
      weeklyHours: customWeeklyHours,
    };
    setCustomization(updated);
    saveStoredCustomization(updated);
    setIsCustomizeOpen(false);
  };

  const handleExploreStageInChat = (stage: RoadmapMilestone) => {
    const topicMessage = `I am exploring Stage ${stage.number}: "${stage.title}". Based on what I already know in My Memory, please give me a clear breakdown:
1. Why this stage is essential for a ${targetGoal} path
2. The recommended step-by-step learning order & core subtopics
3. Concrete practice concepts and problem types to solve
4. Progressive beginner to intermediate project ideas
5. Common pitfalls and mistakes to avoid
6. My immediate next action to begin learning`;

    onStartChatWithTopic(topicMessage);
  };

  const filteredMilestones = milestones.filter((m) => {
    if (!isTrackingEnabled) return true;
    if (filter === 'All') return true;
    if (filter === 'Completed') return m.status === 'Completed';
    if (filter === 'In Progress') return m.status === 'In Progress';
    if (filter === 'Upcoming') return m.status === 'Not Started' || m.status === 'Locked';
    return true;
  });

  const getStatusBadge = (status: MilestoneStatus) => {
    switch (status) {
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Completed</span>
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
            <Clock className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
            <span>In Progress</span>
          </span>
        );
      case 'Not Started':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-800/90 text-slate-300 border border-slate-700/60">
            <CircleDashed className="w-3.5 h-3.5 text-slate-400" />
            <span>Not Started</span>
          </span>
        );
      case 'Locked':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-900/80 text-slate-500 border border-slate-800">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Locked</span>
          </span>
        );
    }
  };

  return (
    <div id="roadmap-view-container" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#07090e] relative">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-6 pb-6 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                <Map className="w-3.5 h-3.5 text-indigo-400" />
                <span>Personalized Learning Path</span>
              </span>

              <span className="text-xs px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium">
                {targetGoal} Pathway
              </span>

              {studentEducation && (
                <span className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
                  <GraduationCap className="w-3.5 h-3.5 text-purple-400" />
                  <span>{studentEducation}</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {/* Optional Progress Tracking Toggle Button */}
              <button
                id="roadmap-toggle-tracking-btn"
                onClick={handleToggleTracking}
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium border transition cursor-pointer ${
                  isTrackingEnabled
                    ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                    : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
                title="Toggle manual progress tracking controls"
              >
                {isTrackingEnabled ? (
                  <>
                    <ToggleRight className="w-4 h-4 text-emerald-400" />
                    <span>Progress Tracking: ON</span>
                  </>
                ) : (
                  <>
                    <ToggleLeft className="w-4 h-4 text-slate-500" />
                    <span>Track My Progress (Optional)</span>
                  </>
                )}
              </button>

              <button
                id="roadmap-customize-btn-header"
                onClick={() => setIsCustomizeOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-indigo-600/20 text-indigo-300 hover:bg-indigo-600/30 border border-indigo-500/30 transition cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Customize Path</span>
              </button>

              <button
                onClick={handleResetRoadmap}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition cursor-pointer"
                title="Recalculate recommendations from My Memory"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Recalculate</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Recommended Learning Plan: {targetGoal}
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Based on what you already know, your interests and your career goal, here is your personalized sequence of what to learn next with practical projects and exercise ideas.
          </p>
        </div>

        {/* Learning Profile Context Card */}
        <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-[#090d16] border border-slate-800/90 shadow-xl shadow-black/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Familiar Skills Section */}
            <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800/80">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Already familiar with (from My Memory)</span>
              </div>
              {familiarSkillsList.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {familiarSkillsList.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-950/40 text-emerald-300 border border-emerald-500/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-slate-400 italic">
                  No existing skills recorded in My Memory yet. As you chat with NextPath AI, familiar topics will appear here.
                </div>
              )}
            </div>

            {/* Recommended Next Focus */}
            <div className="p-4 rounded-xl bg-[#0d1322] border border-slate-800/80">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Recommended First Step</span>
              </div>
              {milestones.length > 0 ? (
                <div>
                  <div className="text-sm font-bold text-white mb-0.5">
                    Stage 1: {milestones[0].title}
                  </div>
                  <div className="text-xs text-slate-300 line-clamp-2">
                    {milestones[0].description}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400">Loading tailored pathway...</div>
              )}
            </div>
          </div>

          {/* Optional Progress Dashboard (Shown ONLY if explicitly enabled by student) */}
          {isTrackingEnabled && (
            <div className="mt-5 pt-4 border-t border-slate-800/80 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Self-Reported Progress
                  </div>
                  <div className="text-lg font-bold text-white flex items-baseline gap-2">
                    <span>{progressPercent}% Tracked</span>
                    <span className="text-xs font-normal text-slate-400">
                      ({completedCount} of {totalCount} stages marked completed)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-[#060911] border border-slate-800 text-center">
                    <div className="text-xs font-bold text-emerald-400">{completedCount}</div>
                    <div className="text-[10px] text-slate-400">Completed</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-[#060911] border border-slate-800 text-center">
                    <div className="text-xs font-bold text-indigo-400">{inProgressCount}</div>
                    <div className="text-[10px] text-slate-400">In Progress</div>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-[#060911] border border-slate-800 text-center">
                    <div className="text-xs font-bold text-slate-400">{totalCount - completedCount - inProgressCount}</div>
                    <div className="text-[10px] text-slate-400">Not Started</div>
                  </div>
                </div>
              </div>

              <div className="w-full h-2 bg-slate-800/90 rounded-full overflow-hidden border border-slate-700/30">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Filter Tabs when tracking is ON */}
              <div className="mt-4 flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  {(['All', 'In Progress', 'Completed', 'Upcoming'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setFilter(tab)}
                      className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                        filter === tab
                          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <div className="text-[11px] text-slate-400">
                  Showing {filteredMilestones.length} of {totalCount} stages
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recommended Learning Stages List */}
        <div className="space-y-6 relative">
          {/* Vertical connecting line */}
          <div className="absolute left-[21px] top-6 bottom-6 w-0.5 bg-slate-800/80 hidden sm:block pointer-events-none" />

          {filteredMilestones.map((stage) => {
            const isCompleted = isTrackingEnabled && stage.status === 'Completed';
            const isInProgress = isTrackingEnabled && stage.status === 'In Progress';
            const isExpanded = !!expandedStages[stage.id];
            const guidance = stage.guidance;

            return (
              <div
                key={stage.id}
                id={`stage-card-${stage.id}`}
                className="relative flex flex-col sm:flex-row items-start gap-3 sm:gap-5 group"
              >
                {/* Stage Step Number Badge */}
                <div className="relative z-10 shrink-0 hidden sm:block">
                  <div
                    className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-sm border shadow-lg ${
                      isCompleted
                        ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-400 shadow-emerald-950/40'
                        : isInProgress
                        ? 'bg-indigo-950/90 border-indigo-500/50 text-indigo-300 shadow-indigo-950/50'
                        : 'bg-[#090d16] border-slate-800 text-indigo-400 shadow-black/40'
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : (
                      <span>{stage.number < 10 ? `0${stage.number}` : stage.number}</span>
                    )}
                  </div>
                </div>

                {/* Stage Content Card */}
                <div
                  className={`flex-1 w-full rounded-2xl p-5 sm:p-6 transition-all duration-200 border ${
                    isCompleted
                      ? 'bg-[#090d16] border-emerald-500/25'
                      : isInProgress
                      ? 'bg-[#0b101d] border-indigo-500/40 shadow-md shadow-indigo-950/30'
                      : 'bg-[#090d16] border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Card Top Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex sm:hidden w-6 h-6 rounded-lg bg-indigo-950/80 border border-indigo-500/30 text-indigo-300 items-center justify-center text-xs font-bold">
                        {stage.number}
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        Stage {stage.number}
                      </span>
                      {stage.estimatedTime && (
                        <>
                          <span className="text-slate-500">•</span>
                          <span className="text-xs font-medium text-slate-400">
                            {stage.estimatedTime}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Progress tracking controls (Only if enabled) */}
                    {isTrackingEnabled && (
                      <div className="flex items-center gap-2">
                        {getStatusBadge(stage.status)}
                        <select
                          aria-label={`Change status for stage ${stage.number}`}
                          value={stage.status}
                          onChange={(e) =>
                            handleUpdateStatus(stage.id, e.target.value as MilestoneStatus)
                          }
                          className="bg-slate-900 border border-slate-700/60 text-slate-300 text-[11px] rounded-lg px-2 py-0.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
                        >
                          <option value="Completed">Completed</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Not Started">Not Started</option>
                          <option value="Locked">Locked</option>
                        </select>
                      </div>
                    )}
                  </div>

                  {/* Stage Title */}
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <span>{stage.title}</span>
                  </h3>

                  {/* Stage Description */}
                  <p className="text-xs sm:text-sm text-slate-300 mb-4 leading-relaxed">
                    {stage.description}
                  </p>

                  {/* Core Topics Chips */}
                  <div className="mb-4">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                      Key Focus Areas
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {stage.skills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-[#06080e] border border-slate-800 text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Expandable Learn & Practice Details Accordion */}
                  {guidance && (
                    <div className="mb-4">
                      <button
                        type="button"
                        id={`toggle-guidance-${stage.id}`}
                        onClick={() => toggleStageDetails(stage.id)}
                        className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#060912] hover:bg-[#0c1120] border border-slate-800 text-left transition cursor-pointer group"
                      >
                        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-300">
                          <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Learn & Practice Guidance</span>
                          <span className="text-[10px] text-slate-400 font-normal">
                            (Subtopics, Practice & Projects)
                          </span>
                        </div>
                        <div className="text-slate-400 group-hover:text-white transition">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </div>
                      </button>

                      {isExpanded && (
                        <div
                          id={`guidance-content-${stage.id}`}
                          className="mt-3 p-4 rounded-xl bg-[#060912] border border-slate-800/90 space-y-4 text-xs animate-in fade-in duration-200"
                        >
                          {/* Why It Matters */}
                          <div>
                            <div className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                              <span>Why It Matters</span>
                            </div>
                            <p className="text-slate-300 leading-relaxed pl-5">
                              {guidance.whyItMatters}
                            </p>
                          </div>

                          {/* Recommended Learning Order & Subtopics */}
                          <div>
                            <div className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5 text-[11px] uppercase tracking-wider">
                              <ListOrdered className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Recommended Learning Order</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-5">
                              {guidance.learningOrder.map((step, idx) => (
                                <div
                                  key={idx}
                                  className="px-2.5 py-1 rounded-lg bg-[#0b101d] border border-slate-800/80 text-slate-300 text-[11px]"
                                >
                                  {step}
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Practice Ideas */}
                          <div>
                            <div className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5 text-[11px] uppercase tracking-wider">
                              <Code2 className="w-3.5 h-3.5 text-blue-400" />
                              <span>Concrete Practice Exercises</span>
                            </div>
                            <ul className="list-disc pl-9 space-y-1 text-slate-300">
                              {guidance.practiceIdeas.map((idea, idx) => (
                                <li key={idx} className="leading-relaxed">
                                  {idea}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Progressive Project Ideas */}
                          <div>
                            <div className="font-semibold text-slate-300 flex items-center gap-1.5 mb-2 text-[11px] uppercase tracking-wider">
                              <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Recommended Student Projects</span>
                            </div>
                            <div className="space-y-1.5 pl-5">
                              <div className="p-2.5 rounded-lg bg-[#0a121e] border border-emerald-500/20 text-[11px]">
                                <span className="font-bold text-emerald-400">Beginner: </span>
                                <span className="text-slate-200">{guidance.projects.beginner}</span>
                              </div>
                              <div className="p-2.5 rounded-lg bg-[#0a121e] border border-indigo-500/20 text-[11px]">
                                <span className="font-bold text-indigo-400">Intermediate: </span>
                                <span className="text-slate-200">{guidance.projects.intermediate}</span>
                              </div>
                              {guidance.projects.advanced && (
                                <div className="p-2.5 rounded-lg bg-[#0a121e] border border-purple-500/20 text-[11px]">
                                  <span className="font-bold text-purple-400">Advanced: </span>
                                  <span className="text-slate-200">{guidance.projects.advanced}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Common Mistakes to Avoid */}
                          <div>
                            <div className="font-semibold text-slate-300 flex items-center gap-1.5 mb-1 text-[11px] uppercase tracking-wider">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
                              <span>Common Pitfalls to Avoid</span>
                            </div>
                            <ul className="list-disc pl-9 space-y-1 text-rose-300/90 text-[11px]">
                              {guidance.commonMistakes.map((mistake, idx) => (
                                <li key={idx} className="leading-relaxed">
                                  {mistake}
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Suggested Next Action */}
                          <div className="pt-2 border-t border-slate-800/80">
                            <div className="text-[11px] text-slate-400">
                              <span className="font-bold text-indigo-300">Suggested Action: </span>
                              <span className="text-slate-300">{guidance.suggestedNextAction}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Card Bottom Controls */}
                  <div className="pt-3 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-3">
                    {isTrackingEnabled ? (
                      <button
                        onClick={() => handleToggleComplete(stage.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20 border border-emerald-500/30'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{isCompleted ? 'Completed ✓' : 'Mark as Completed'}</span>
                      </button>
                    ) : (
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Recommended Sequence</span>
                      </div>
                    )}

                    {/* Ask NextPath in Chat Link */}
                    <button
                      id={`explore-stage-btn-${stage.id}`}
                      onClick={() => handleExploreStageInChat(stage)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition cursor-pointer group"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-12 transition-transform" />
                      <span>Explore this stage with NextPath</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Guidance Banner */}
        <div className="mt-10 p-5 rounded-2xl bg-gradient-to-r from-blue-950/30 via-indigo-950/30 to-purple-950/30 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 shrink-0">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-white">Need a customized learning timeline?</div>
              <div className="text-xs text-slate-400">
                Customize your target role and study hours, or consult NextPath AI for a tailored semester schedule.
              </div>
            </div>
          </div>

          <button
            id="roadmap-customize-path-footer-btn"
            onClick={() => setIsCustomizeOpen(true)}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition shadow-sm shrink-0 cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Customize My Path</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Customize Path Modal Dialog */}
      {isCustomizeOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div
            id="roadmap-customizer-dialog"
            className="w-full max-w-lg rounded-2xl bg-[#0b0f19] border border-slate-800 shadow-2xl p-6 relative overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Customize Your Pathway</h2>
                  <p className="text-xs text-slate-400">Tailor recommended learning order to your career goal</p>
                </div>
              </div>
              <button
                onClick={() => setIsCustomizeOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customizer Form */}
            <form onSubmit={handleApplyCustomization} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Target Career Role
                </label>
                <select
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="Software Developer">Software Developer (General / Problem Solving)</option>
                  <option value="Frontend Web Developer">Frontend Web Developer (React, UI/UX, Web)</option>
                  <option value="Backend Systems Developer">Backend Systems Developer (APIs, Databases, Microservices)</option>
                  <option value="Full-Stack Developer">Full-Stack Developer (MERN / Next.js / Cloud)</option>
                  <option value="AI / ML Engineer">AI / ML Engineer (Python, Data, LLMs)</option>
                  <option value="Mobile Application Developer">Mobile Application Developer (React Native / Android)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Weekly Study & Practice Availability
                </label>
                <select
                  value={customWeeklyHours}
                  onChange={(e) => setCustomWeeklyHours(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="5 - 10 Hours / Week">5 - 10 Hours / Week (Steady / Light)</option>
                  <option value="15 Hours / Week">15 Hours / Week (Standard Student Track)</option>
                  <option value="20 - 25 Hours / Week">20 - 25 Hours / Week (Accelerated Semester Track)</option>
                  <option value="30+ Hours / Week">30+ Hours / Week (Intensive Bootcamp Pace)</option>
                </select>
              </div>

              {/* Verified Memory Preview */}
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
                <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-indigo-400" />
                  <span>My Memory Context</span>
                </div>
                {familiarSkillsList.length > 0 || studentEducation ? (
                  <div className="text-xs text-slate-300 space-y-1">
                    {studentEducation && <div>• Education: <span className="text-purple-300 font-medium">{studentEducation}</span></div>}
                    {familiarSkillsList.length > 0 && <div>• Already familiar with: <span className="text-emerald-300 font-medium">{familiarSkillsList.join(', ')}</span></div>}
                  </div>
                ) : (
                  <div className="text-xs text-slate-400 italic">
                    No skills saved yet in My Memory. Your roadmap will update automatically as you converse with NextPath AI.
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCustomizeOpen(false);
                    onStartChatWithTopic(
                      `I'd like to plan a personalized learning plan for a ${customRole} role studying ${customWeeklyHours}. Here is my current background:`
                    );
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-indigo-300 hover:bg-indigo-950/40 border border-indigo-500/20 transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Consult with Advisor Chat</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCustomizeOpen(false)}
                    className="px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition shadow-sm cursor-pointer"
                  >
                    Apply Roadmap
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
