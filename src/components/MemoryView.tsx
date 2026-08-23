import React, { useState } from 'react';
import { 
  Brain, 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ShieldCheck, 
  GraduationCap, 
  Code, 
  Target, 
  Sliders, 
  FileText, 
  User, 
  RotateCcw, 
  Bookmark,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { MemoryItem } from '../types';

interface MemoryViewProps {
  memories: MemoryItem[];
  onAddMemory: (item: Omit<MemoryItem, 'id' | 'updatedAt'>) => void;
  onUpdateMemory: (id: string, updated: Partial<MemoryItem>) => void;
  onDeleteMemory: (id: string) => void;
  onClearAllMemory: () => void;
}

export const MemoryView: React.FC<MemoryViewProps> = ({
  memories,
  onAddMemory,
  onUpdateMemory,
  onDeleteMemory,
  onClearAllMemory,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showClearConfirm, setShowClearConfirm] = useState<boolean>(false);

  // New Memory Form State
  const [newCategory, setNewCategory] = useState<MemoryItem['category']>('Skills');
  const [newLabel, setNewLabel] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');

  // Inline Edit State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editCategory, setEditCategory] = useState<MemoryItem['category']>('Skills');
  const [editLabel, setEditLabel] = useState<string>('');
  const [editValue, setEditValue] = useState<string>('');

  const categories: MemoryItem['category'][] = [
    'Personal',
    'Education',
    'Skills',
    'Interests',
    'Goals',
    'Preferences',
    'Notes',
  ];

  const handleStartEdit = (item: MemoryItem) => {
    setEditingId(item.id);
    setEditCategory(item.category);
    setEditLabel(item.label);
    setEditValue(item.value);
  };

  const handleSaveEdit = (id: string) => {
    if (!editValue.trim()) return;
    onUpdateMemory(id, {
      category: editCategory,
      label: editLabel.trim() || 'Career Memory',
      value: editValue.trim(),
      updatedAt: 'Updated just now',
    });
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newValue.trim()) return;
    onAddMemory({
      category: newCategory,
      label: newLabel.trim() || getDefaultLabelForCategory(newCategory),
      value: newValue.trim(),
    });
    setNewLabel('');
    setNewValue('');
    setShowAddModal(false);
  };

  const getDefaultLabelForCategory = (cat: MemoryItem['category']): string => {
    switch (cat) {
      case 'Personal':
        return 'Student Name';
      case 'Education':
        return 'Degree / Level';
      case 'Skills':
        return 'Skill / Competency';
      case 'Interests':
        return 'Career Interest';
      case 'Goals':
        return 'Career Target';
      case 'Preferences':
        return 'Learning Preference';
      case 'Notes':
      default:
        return 'Career Note';
    }
  };

  const getCategoryIcon = (category: MemoryItem['category']) => {
    switch (category) {
      case 'Personal':
        return <User className="w-4 h-4 text-blue-400" />;
      case 'Education':
        return <GraduationCap className="w-4 h-4 text-purple-400" />;
      case 'Skills':
        return <Code className="w-4 h-4 text-emerald-400" />;
      case 'Interests':
        return <Bookmark className="w-4 h-4 text-cyan-400" />;
      case 'Goals':
        return <Target className="w-4 h-4 text-rose-400" />;
      case 'Preferences':
        return <Sliders className="w-4 h-4 text-amber-400" />;
      case 'Notes':
      default:
        return <FileText className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getCategoryBadgeClass = (category: MemoryItem['category']) => {
    switch (category) {
      case 'Personal':
        return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
      case 'Education':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/20';
      case 'Skills':
        return 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20';
      case 'Interests':
        return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20';
      case 'Goals':
        return 'bg-rose-500/10 text-rose-300 border-rose-500/20';
      case 'Preferences':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/20';
      case 'Notes':
      default:
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20';
    }
  };

  const filteredMemories = memories.filter((m) => {
    if (selectedFilter === 'All') return true;
    return m.category === selectedFilter;
  });

  return (
    <div id="memory-view-container" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#07090e] relative">
      {/* Ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <div className="mb-6 pb-6 border-b border-slate-800/80">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                <Brain className="w-3.5 h-3.5 text-purple-400" />
                <span>Student Memory Profile</span>
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-slate-800/90 text-slate-300 border border-slate-700/60 font-medium">
                {memories.length} {memories.length === 1 ? 'entry' : 'entries'} stored
              </span>
            </div>

            <div className="flex items-center gap-2">
              {memories.length > 0 && (
                <button
                  id="clear-all-memory-btn"
                  onClick={() => setShowClearConfirm(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All</span>
                </button>
              )}

              <button
                id="add-memory-button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition shadow-sm cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Memory</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            My Memory
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            NextPath can remember useful information about your interests, skills and career goals to provide more personalized guidance.
          </p>
        </div>

        {/* Privacy Notice Banner */}
        <div
          id="memory-privacy-banner"
          className="mb-6 p-4 rounded-2xl bg-[#090d16] border border-indigo-500/20 flex items-start sm:items-center justify-between gap-3 shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-semibold text-slate-200">
                Your memory is stored locally in this browser.
              </div>
              <div className="text-[11px] text-slate-400">
                No external database or cookies are used. Information remains completely private on your device.
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 shrink-0">
            <CheckCircle2 className="w-3 h-3" />
            <span>Active & Synced</span>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        {memories.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-2 pb-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {(['All', ...categories] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedFilter(tab)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    selectedFilter === tab
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="text-[11px] text-slate-400">
              Showing {filteredMemories.length} of {memories.length} memories
            </div>
          </div>
        )}

        {/* Memory Items Grid / List */}
        {memories.length === 0 ? (
          /* Clean Empty State */
          <div
            id="empty-memory-state"
            className="p-8 sm:p-12 rounded-2xl bg-[#090d16] border border-slate-800 text-center flex flex-col items-center justify-center my-6"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-4">
              <Brain className="w-7 h-7" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">No Saved Memories Yet</h3>
            <p className="text-xs sm:text-sm text-slate-400 max-w-md mb-6 leading-relaxed">
              Add your current education, skills, interests, and target career goals so NextPath AI can tailor its recommendations.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                id="add-first-memory-btn"
                onClick={() => setShowAddModal(true)}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition shadow-md shadow-indigo-950/30 cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Your First Memory</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMemories.map((item) => {
              const isEditing = editingId === item.id;

              return (
                <div
                  key={item.id}
                  id={`memory-card-${item.id}`}
                  className={`p-5 rounded-2xl bg-[#090d16] border transition-all duration-200 flex flex-col justify-between ${
                    isEditing
                      ? 'border-indigo-500/60 shadow-lg shadow-indigo-950/40 bg-[#0b101c]'
                      : 'border-slate-800/90 hover:border-slate-700'
                  }`}
                >
                  {isEditing ? (
                    /* Inline Edit Mode */
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-indigo-300 flex items-center gap-1.5">
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Editing Memory</span>
                        </span>
                        <select
                          value={editCategory}
                          onChange={(e) => setEditCategory(e.target.value as MemoryItem['category'])}
                          className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-lg px-2 py-1 focus:outline-none focus:border-indigo-500"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                          Label
                        </label>
                        <input
                          type="text"
                          value={editLabel}
                          onChange={(e) => setEditLabel(e.target.value)}
                          placeholder="e.g. Current Skills"
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1 font-medium">
                          Value / Detail
                        </label>
                        <textarea
                          rows={3}
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          placeholder="e.g. JavaScript, React, Python..."
                          className="w-full px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
                        />
                      </div>

                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="px-3 py-1 rounded-lg text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveEdit(item.id)}
                          className="px-3.5 py-1 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition cursor-pointer flex items-center gap-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Display Mode */
                    <>
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-800">
                              {getCategoryIcon(item.category)}
                            </div>
                            <span
                              className={`text-[11px] font-semibold px-2 py-0.5 rounded-md border ${getCategoryBadgeClass(
                                item.category
                              )}`}
                            >
                              {item.category}
                            </span>
                          </div>

                          <span className="text-[10px] text-slate-400 font-medium">
                            {item.updatedAt}
                          </span>
                        </div>

                        <div className="text-xs font-bold text-slate-300 mb-1">
                          {item.label}
                        </div>

                        <p className="text-xs sm:text-sm text-slate-100 font-normal leading-relaxed whitespace-pre-wrap">
                          {item.value}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Available to AI</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleStartEdit(item)}
                            title="Edit memory item"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteMemory(item.id)}
                            title="Delete memory item"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Add Memory Modal Overlay */}
        {showAddModal && (
          <div
            id="add-memory-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          >
            <div className="w-full max-w-lg rounded-2xl bg-[#090d16] border border-slate-800 p-5 sm:p-6 shadow-2xl shadow-black/80">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
                    <Plus className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-bold text-white">Add Career Memory</h3>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1.5">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => {
                      const cat = e.target.value as MemoryItem['category'];
                      setNewCategory(cat);
                      if (!newLabel) {
                        setNewLabel(getDefaultLabelForCategory(cat));
                      }
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1.5">
                    Label / Field Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    placeholder={getDefaultLabelForCategory(newCategory)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300 font-semibold mb-1.5">
                    Detail / Memory Content
                  </label>
                  <textarea
                    rows={4}
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    placeholder="e.g. Proficient in Python and TypeScript, targeting fullstack developer internships in 2026..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 placeholder-slate-400 resize-none leading-relaxed"
                  />
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newValue.trim()}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 transition cursor-pointer"
                  >
                    Save Memory
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Clear All Confirmation Dialog */}
        {showClearConfirm && (
          <div
            id="clear-confirm-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          >
            <div className="w-full max-w-md rounded-2xl bg-[#090d16] border border-rose-500/30 p-5 sm:p-6 shadow-2xl shadow-black/80">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Clear All Memories?</h3>
                  <p className="text-xs text-slate-400">
                    This will remove all saved context from this browser's local storage.
                  </p>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowClearConfirm(false)}
                  className="px-3.5 py-1.5 rounded-xl text-xs text-slate-400 hover:text-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onClearAllMemory();
                    setShowClearConfirm(false);
                  }}
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition cursor-pointer"
                >
                  Yes, Clear All
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
