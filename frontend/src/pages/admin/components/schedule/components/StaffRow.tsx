
import React from 'react';
import { Sun, Moon, Sunrise, Coffee } from 'lucide-react';
import { cn, getShiftForDate } from '../../../../../lib/utils';
import { Person, Task } from '../../../../../types';
import { TaskCard } from './TaskCard';

interface StaffRowProps {
  person: Person;
  tasks: Task[];
  currentDate: Date;
  activeLang: string;
  gridTemplateColumns: string;
  isRTL: boolean;
  totalHours: number;
  getShiftBarStyle: (time: string) => React.CSSProperties;
  getTaskStyle: (task: Task) => React.CSSProperties;
  getDurationMinutes: (task: Task) => number;
  onTaskClick: (task: Task) => void;
  startHour: number;
  endHour: number;
  getNormalizedHour: (h: number) => number;
}

export const StaffRow: React.FC<StaffRowProps> = ({
  person,
  tasks,
  currentDate,
  activeLang,
  gridTemplateColumns,
  isRTL,
  totalHours,
  getShiftBarStyle,
  getTaskStyle,
  getDurationMinutes,
  onTaskClick,
  startHour,
  endHour,
  getNormalizedHour,
}) => {
  const shift = getShiftForDate(person.id, currentDate, activeLang);

  const personTasks = tasks.filter((task) => {
    const [sH_raw] = task.timeStart.split(':').map(Number);
    const sH_norm = getNormalizedHour(sH_raw);
    if (sH_norm < startHour || sH_norm >= endHour) return false;
    if (task.shiftRole === shift.id) return true;
    if (task.assigneeId === person.id && !task.shiftRole) return true;
    return false;
  });

  const ShiftIcon =
    shift.type === 'day' ? Sun :
    shift.type === 'eve' ? Sunrise :
    shift.type === 'night' ? Moon :
    Coffee;

  return (
    <div
      className="grid border-b border-gray-100 min-h-[140px] hover:bg-gray-50/30 group relative z-10"
      style={{ gridTemplateColumns }}
    >
      <div
        className={cn(
          'sticky z-[110] bg-white p-4 flex flex-col justify-center shadow-[4px_0_8px_rgba(0,0,0,0.05)]',
          isRTL ? "right-0 border-l border-l-gray-300 border-r-4" : "left-0 border-r border-r-gray-300 border-l-4",
          person.teamColor === 'red' && (isRTL ? 'border-r-red-500' : 'border-l-red-500'),
          person.teamColor === 'blue' && (isRTL ? 'border-r-blue-500' : 'border-l-blue-500'),
          person.teamColor === 'purple' && (isRTL ? 'border-r-purple-500' : 'border-l-purple-500'),
          person.teamColor === 'white' && (isRTL ? 'border-r-gray-400' : 'border-l-gray-400')
        )}
      >
        <div className="flex items-center gap-3">
          <img src={person.avatar} alt={person.name} className="w-10 h-10 rounded-full border border-gray-100 shadow-sm" />
          <div className="flex flex-col min-w-0">
            <div className="font-bold text-gray-900 text-sm truncate leading-tight mb-0.5">
              {person.name}
            </div>
            <div className="text-[9px] text-gray-400 font-black uppercase tracking-widest leading-none mb-2">
              {person.role}
            </div>
            <div className="flex items-center gap-1">
              <ShiftIcon
                size={11}
                className={cn(
                  shift.type === 'day' ? "text-orange-500" :
                  shift.type === 'eve' ? "text-amber-600" :
                  shift.type === 'night' ? "text-slate-600" :
                  "text-gray-400"
                )}
              />
              <div className="text-[10px] text-gray-600 uppercase font-black tracking-tight truncate leading-none">
                {shift.label}
              </div>
            </div>
            <div className="text-[10px] text-gray-400 font-bold mt-1 tracking-tight truncate">
              {shift.time}
            </div>
          </div>
        </div>
      </div>

      <div className="relative" style={{ gridColumn: `2 / span ${totalHours}` }}>
        <div
          className={cn("absolute top-0 bottom-0 pointer-events-none opacity-5", shift.color)}
          style={getShiftBarStyle(shift.time)}
        />
        {personTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onTaskClick={onTaskClick}
            getTaskStyle={getTaskStyle}
            getDurationMinutes={getDurationMinutes}
          />
        ))}
      </div>
    </div>
  );
};
