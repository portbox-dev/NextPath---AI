import React, { useState } from 'react';
import { Settings, Palette, Bell, Shield, User, GraduationCap, Check } from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [studentLevel, setStudentLevel] = useState('Undergraduate (Year 2-3)');
  const [targetFocus, setTargetFocus] = useState('Software Engineering & AI');
  const [dailyReminders, setDailyReminders] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div id="settings-view-container" className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#07090e]">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8 pb-6 border-b border-slate-800/80">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Settings className="w-4 h-4" />
            <span>Preferences</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Settings
          </h2>
          <p className="text-sm text-slate-400">
            Configure student learning preferences and NextPath AI interface settings.
          </p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Student Profile Settings */}
          <div className="p-6 rounded-2xl bg-[#0b101c] border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Student Profile & Track</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Academic Level
                </label>
                <select
                  value={studentLevel}
                  onChange={(e) => setStudentLevel(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="High School Student">High School Student</option>
                  <option value="Undergraduate (Year 1)">Undergraduate (Year 1)</option>
                  <option value="Undergraduate (Year 2-3)">Undergraduate (Year 2-3)</option>
                  <option value="Final Year / Graduating">Final Year / Graduating</option>
                  <option value="Graduate / Master's Student">Graduate / Master's Student</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Primary Career Focus
                </label>
                <select
                  value={targetFocus}
                  onChange={(e) => setTargetFocus(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="Software Engineering & AI">Software Engineering & AI</option>
                  <option value="Data Science & Analytics">Data Science & Analytics</option>
                  <option value="Cybersecurity & Cloud">Cybersecurity & Cloud</option>
                  <option value="Product Management & UX">Product Management & UX</option>
                  <option value="Exploratory / Undecided">Exploratory / Undecided</option>
                </select>
              </div>
            </div>
          </div>

          {/* Theme & Visuals */}
          <div className="p-6 rounded-2xl bg-[#0b101c] border border-slate-800/80 space-y-4">
            <div className="flex items-center gap-2.5 text-sm font-semibold text-white">
              <Palette className="w-4 h-4 text-purple-400" />
              <span>Appearance & Theme</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-800/60">
              <div>
                <div className="text-sm font-medium text-slate-200">Theme Palette</div>
                <div className="text-xs text-slate-400">Dark navy with neon blue & purple highlights</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 rounded-full bg-blue-500 ring-2 ring-indigo-500/50" />
                <span className="w-4 h-4 rounded-full bg-indigo-500 ring-2 ring-indigo-500/50" />
                <span className="w-4 h-4 rounded-full bg-purple-500 ring-2 ring-indigo-500/50" />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <div className="text-sm font-medium text-slate-200">Roadmap Milestones Notification</div>
                <div className="text-xs text-slate-400">Prompt suggestions for semester checkpoints</div>
              </div>
              <button
                type="button"
                onClick={() => setDailyReminders(!dailyReminders)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition cursor-pointer ${
                  dailyReminders ? 'bg-indigo-600 justify-end' : 'bg-slate-800 justify-start'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-md transform transition" />
              </button>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-between pt-2">
            <div>
              {savedSuccess && (
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Preferences updated successfully
                </span>
              )}
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition shadow-md shadow-indigo-950/40 cursor-pointer"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
