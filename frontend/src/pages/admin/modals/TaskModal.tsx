
import React, { useState } from 'react';
import { X, Trash2, Save, FileText, CheckCircle2 } from 'lucide-react';
import { Button } from '../../../components/Button';
import { cn, formatLocalDate } from '../../../lib/utils';
import { Task, Person, TaskCategory, TaskStatus } from '../../../types';
import { validateShiftCompatibility, validateTaskOverlap } from '../../../lib/validation';
import { useTasks } from '../../../context/TaskContext';
import { AlertTriangle } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Partial<Task> | null;
  staffList: Person[];
  users: Person[];
  onSave: (task: Partial<Task>) => void;
  onDelete?: (id: string) => void;
  date: Date; // For validation
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  task,
  staffList,
  onSave,
  onDelete,
  date
}) => {
  if (!isOpen) return null;

  const { tasks } = useTasks();
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Task>>(() => {
    if (!task) {
      return {
        title: '',
        timeStart: '08:00',
        timeEnd: '09:00',
        category: TaskCategory.CARE,
        status: TaskStatus.PENDING,
        description: '',
        assigneeId: staffList[0]?.id || '',
        requiresSign: false
      };
    }
    // If task exists but has no assigneeId (e.g. shift task), default to first staff in list
    // so the dropdown matches the state.
    return {
      ...task,
      assigneeId: task.assigneeId || staffList[0]?.id || ''
    };
  });

  const handleSave = () => {
    setError(null);
    // Allow missing assigneeId IF shiftRole is present (recurring tasks)
    const isAssigned = formData.assigneeId || formData.shiftRole;
    if (!isAssigned || !formData.timeStart || !formData.timeEnd) {
      setError("Alla fält måste fyllas i.");
      return;
    }

    // Validation: Only block if it's a NEW task creation.
    // If it's an existing task (task.id exists), we allow the admin to override/sign.
    const shiftCheck = validateShiftCompatibility(
      formData.assigneeId,
      date,
      formData.timeStart,
      formData.timeEnd,
      'sv',
      staffList
    );
    if (!shiftCheck.isValid && !task?.id) {
      setError(`Kan ej spara: ${shiftCheck.error}`);
      return;
    }

    // Overlap check: Strict for new tasks, bypass for existing tasks (admin override).
    const overlapCheck = validateTaskOverlap(
      formData.assigneeId,
      date,
      formData.timeStart,
      formData.timeEnd,
      tasks,
      formData.id,
      'sv',
      staffList
    );
    if (!overlapCheck.isValid && !task?.id) {
      setError(`Krockar med annan uppgift: ${overlapCheck.error}`);
      return;
    }

    const dateStr = formatLocalDate(date);

    onSave({
      ...formData,
      validOnDate: dateStr
    });
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content - Centered */}
      <div className="relative bg-white w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-scale-in flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white">
          <h3 className="font-bold text-lg text-gray-900">{task?.id ? 'Hantera uppgift' : 'Ny uppgift'}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"><X size={20} /></button>
        </div>

        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-800 text-sm font-bold animate-pulse">
            <AlertTriangle size={18} className="text-red-600" />
            {error}
          </div>
        )}

        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wide">Titel</label>
            <input
              className="w-full p-3 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-municipal-500 outline-none font-bold text-lg shadow-sm placeholder:text-gray-400"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ex. Morgonstöd"
              autoFocus
            />
          </div>

          {/* Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wide">Starttid</label>
              <input
                type="time"
                className="w-full p-2.5 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-municipal-500 outline-none shadow-sm"
                value={formData.timeStart}
                onChange={e => setFormData({ ...formData, timeStart: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wide">Sluttid</label>
              <input
                type="time"
                className="w-full p-2.5 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-municipal-500 outline-none shadow-sm"
                value={formData.timeEnd}
                onChange={e => setFormData({ ...formData, timeEnd: e.target.value })}
              />
            </div>
          </div>

          {/* Assignment Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wide">Personal (Flytta)</label>
              <select
                className="w-full p-2.5 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-municipal-500 outline-none shadow-sm"
                value={formData.assigneeId}
                onChange={e => setFormData({ ...formData, assigneeId: e.target.value })}
              >
                {staffList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wide">Kategori</label>
              <select
                className="w-full p-2.5 border border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-municipal-500 outline-none shadow-sm"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as TaskCategory })}
              >
                {Object.values(TaskCategory).map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
              </select>
            </div>
          </div>

          {/* Status Buttons */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2 tracking-wide">Status & Signering</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setFormData({ ...formData, status: TaskStatus.PENDING })}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg border transition-all",
                  formData.status === TaskStatus.PENDING
                    ? "bg-gray-800 text-white border-gray-800 shadow-md transform scale-105"
                    : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
              >
                Planerad
              </button>

              <button
                onClick={() => setFormData({ ...formData, status: TaskStatus.COMPLETED })}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg border transition-all flex items-center gap-2",
                  formData.status === TaskStatus.COMPLETED
                    ? "bg-blue-600 text-white border-blue-600 shadow-md transform scale-105"
                    : "bg-white border-gray-200 text-blue-700 hover:bg-blue-50"
                )}
              >
                <CheckCircle2 size={14} /> Utförd
              </button>

              <button
                onClick={() => setFormData({ ...formData, status: TaskStatus.SIGNED })}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg border transition-all flex items-center gap-2",
                  formData.status === TaskStatus.SIGNED
                    ? "bg-green-600 text-white border-green-600 shadow-md transform scale-105"
                    : "bg-white border-gray-100 text-green-700 hover:bg-green-50"
                )}
              >
                <FileText size={14} /> Signerad
              </button>

              <button
                onClick={() => setFormData({ ...formData, status: TaskStatus.MISSED })}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg border transition-all",
                  formData.status === TaskStatus.MISSED
                    ? "bg-red-600 text-white border-red-600 shadow-md transform scale-105"
                    : "bg-white border-gray-200 text-red-700 hover:bg-red-50"
                )}
              >
                Missad
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5 tracking-wide">Beskrivning / Notering</label>
            <textarea
              className="w-full p-3 border border-gray-300 bg-white text-gray-900 rounded-lg h-24 resize-none focus:ring-2 focus:ring-municipal-500 outline-none shadow-sm placeholder:text-gray-400"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              placeholder="Skriv detaljer här..."
            />
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-100 flex justify-between items-center bg-gray-50 mt-auto">
          <div>
            {formData.id && onDelete && (
              <button
                onClick={() => onDelete(formData.id!)}
                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors"
              >
                <Trash2 size={16} /> Ta bort
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose}>Avbryt</Button>
            <Button onClick={handleSave} className="gap-2 shadow-lg shadow-municipal-500/20">
              <Save size={16} /> Spara
            </Button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out;
        }
      `}</style>
    </div>
  );
};
