
import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, FileText, Stethoscope, ExternalLink, Lock, RotateCcw, ShieldCheck, PenLine, Save, Key, UserPlus } from 'lucide-react';
import { Button } from '../../../components/Button';
import { cn, getCategoryColor } from '../../../lib/utils';
import { Task, TaskCategory, TaskStatus } from '../../../types';
import { getUITranslations } from '../../../lib/translations';
import { useTasks } from '../../../context/TaskContext';
import { useAuth } from '../../../context/AuthContext';

interface TaskSheetProps {
  task: Task | null;
  onClose: () => void;
  onToggleStatus: (taskId: string) => void;
  showVikarieMode: boolean;
  activeLang?: string;
  date: string;
}

export const TaskSheet: React.FC<TaskSheetProps> = ({
  task,
  onClose,
  onToggleStatus,
  showVikarieMode,
  activeLang = 'sv',
  date
}) => {
  const { updateTask } = useTasks();
  const [hasClickedMcss, setHasClickedMcss] = useState(false);
  const [reportContent, setReportContent] = useState('');
  const [toName, setToName] = useState('');
  const t = getUITranslations(activeLang);

  const { user } = useAuth();
  const currentUser = { name: user?.name || user?.username || 'Okänd användare' };
  // const todayStr = new Date().toISOString().split('T')[0]; // Removed: use inherited date prop instead
  // const existingReport = task?.isReportTask ? reports.find(r => r.date === todayStr && r.type === task.reportType && r.unitId === task.unitId) : null;

  useEffect(() => {
    setHasClickedMcss(false);
    if (task?.reportData) {
      setReportContent(task.reportData.content || '');
      setToName(task.reportData.recipient || '');
    } else {
      setReportContent('');
      setToName('');
    }
  }, [task]);

  if (!task) return null;

  const isMedical = task.category === TaskCategory.HSL;
  const isDone = task.status === TaskStatus.COMPLETED || task.status === TaskStatus.SIGNED;
  const isLocked = !isDone && isMedical && !hasClickedMcss;

  const handleUpdateReport = () => {
    if (task.isReportTask) {
      updateTask(task.id, {
        status: TaskStatus.COMPLETED,
        reportData: {
          recipient: toName,
          content: reportContent,
          authorName: currentUser.name,
          timestamp: new Date().toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })
        }
      }, date);
    }
  };

  const handleCompleteReport = () => {
    handleUpdateReport();
    // onToggleStatus(task.id); // Handled by updateTask inside handleUpdateReport
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      {/* Backdrop click logic to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-6 sm:hidden"></div>

        {showVikarieMode && task.substituteInstructions && !isDone && (
          <div className="mb-6 bg-blue-600 rounded-2xl p-5 shadow-xl shadow-blue-200 border border-blue-500">
            <div className="flex items-center gap-2 mb-3 text-white/80">
              <Key size={18} />
              <span className="text-[10px] font-black tracking-widest uppercase">{t.subTitle}</span>
            </div>
            <p className="text-white text-base font-black leading-tight tracking-tight">{task.substituteInstructions}</p>
          </div>
        )}

        <div className="flex justify-between items-start">
          <div className="max-w-[70%]">
            <h2 className="text-2xl font-black text-gray-900 leading-none mb-1 tracking-tight">{task.title}</h2>
            <p className="text-gray-500 text-lg font-bold tracking-tight">{task.timeStart} – {task.timeEnd}</p>
          </div>
          <div className={cn(
            "w-14 h-14 rounded-full flex items-center justify-center shadow-inner shrink-0",
            isDone ? "bg-green-100 text-green-600" : getCategoryColor(task.category)
          )}>
            {task.isReportTask ? <PenLine size={28} /> : isDone ? <CheckCircle2 size={28} /> : <Clock size={28} />}
          </div>
        </div>

        <div className="my-6 space-y-4">
          {isDone && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-2xl flex items-center gap-4">
              <CheckCircle2 size={20} className="text-green-600 shrink-0" />
              <p className="text-sm text-green-900 font-black">{t.taskDone}</p>
            </div>
          )}

          {task.isReportTask ? (
            <div className="space-y-4">
              {/* Receiver Block */}
              <div className="bg-municipal-50 rounded-2xl p-4 border border-municipal-100 shadow-sm transition-all hover:bg-municipal-100/50">
                <label className="flex items-center gap-2 text-[10px] font-black text-municipal-700 uppercase tracking-[0.15em] mb-2">
                  <UserPlus size={12} strokeWidth={3} /> {t.reportTo}
                </label>
                <input
                  type="text"
                  className="w-full bg-white border-2 border-municipal-200/50 rounded-xl p-3 font-bold text-gray-900 placeholder:text-gray-300 focus:ring-4 ring-municipal-500/10 focus:border-municipal-500 outline-none transition-all"
                  placeholder={t.reportToPlaceholder}
                  value={toName}
                  onChange={(e) => setToName(e.target.value)}
                />
              </div>

              {/* Content Block */}
              <div className="bg-white rounded-2xl p-4 border-2 border-gray-100 shadow-sm transition-all hover:border-municipal-200">
                <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2">
                  <FileText size={12} strokeWidth={3} /> {t.reportContent}
                </label>
                <textarea
                  className="w-full bg-gray-50/50 border-2 border-transparent rounded-xl p-4 h-40 font-medium text-gray-900 placeholder:text-gray-300 focus:bg-white focus:border-municipal-500 outline-none resize-none transition-all leading-relaxed"
                  placeholder={t.reportPlaceholder}
                  value={reportContent}
                  onChange={(e) => setReportContent(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 shadow-inner">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2.5">{t.description}</h4>
              <p className="text-gray-800 leading-relaxed font-bold text-lg">{task.description}</p>
            </div>
          )}

          {isMedical && !isDone && !hasClickedMcss && (
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-2xl flex items-center gap-4 animate-pulse">
              <Lock size={20} className="text-orange-500 shrink-0" />
              <p className="text-sm text-orange-900 font-black">{t.mcssWarning}</p>
            </div>
          )}
        </div>

        <div className="space-y-3 pb-2">
          {isMedical && !isDone && (
            <a
              href="https://apps.apple.com/se/app/mcss/id1079010689"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setHasClickedMcss(true)}
              className="w-full flex items-center justify-between gap-2 p-5 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition-all active:scale-[0.98] shadow-xl shadow-red-100 group mb-3"
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                  <Stethoscope size={22} />
                </div>
                <span className="text-lg">{t.openMcss}</span>
              </div>
              <ExternalLink size={20} className="opacity-70" />
            </a>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1 h-16 rounded-2xl font-black text-lg" onClick={onClose}>
              {activeLang === 'ar' ? 'إلغاء' : 'Avbryt'}
            </Button>

            {task.isReportTask ? (
              <Button
                variant={isDone ? 'secondary' : 'primary'}
                className={cn(
                  "flex-[2] h-16 rounded-2xl gap-2 font-black text-lg transition-all",
                  isDone ? "bg-gray-100 text-gray-600 border-gray-200" : "shadow-xl shadow-municipal-900/20"
                )}
                onClick={handleCompleteReport}
              >
                {isDone ? <RotateCcw size={24} /> : <Save size={24} />}
                {isDone ? t.undo : t.saveReport}
              </Button>
            ) : (
              <Button
                disabled={isLocked}
                variant={isDone ? 'secondary' : 'primary'}
                className={cn(
                  "flex-1 h-16 rounded-2xl gap-2 font-black text-lg transition-all",
                  isLocked ? "bg-gray-200 text-gray-400 border-gray-100" :
                    isDone ? "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200" :
                      "shadow-xl shadow-municipal-900/20 bg-municipal-900 hover:bg-municipal-800"
                )}
                onClick={() => onToggleStatus(task.id)}
              >
                {isDone ? (
                  <> <RotateCcw size={24} /> {t.undo} </>
                ) : task.requiresSign ? (
                  <> <FileText size={24} /> {t.sign} </>
                ) : (
                  <> <CheckCircle2 size={24} /> {t.markDone} </>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
