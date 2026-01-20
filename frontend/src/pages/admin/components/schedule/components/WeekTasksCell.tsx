
import React from 'react';
import { cn, getCategoryColor, getShiftForDate, formatLocalDate } from '../../../../../lib/utils';
import { Task } from '../../../../../types';
import { useTasks } from '../../../../../context/TaskContext';

interface WeekTasksCellProps {
  personId: string;
  day: Date;
  tasks: Task[];
  activeLang: string;
  isRTL: boolean;
  isWeekend: boolean;
  isToday: boolean;
  onTaskClick: (task: Task) => void;
}

export const WeekTasksCell: React.FC<WeekTasksCellProps> = ({
  personId,
  day,
  tasks,
  activeLang,
  isRTL,
  isWeekend,
  isToday,
  onTaskClick,
}) => {
  const { getTaskStatus } = useTasks();
  const shift = getShiftForDate(personId, day, activeLang);
  const dateKey = formatLocalDate(day);

  const dailyTasks = shift.type === 'off' ? [] : tasks.filter((task) => {
    if (task.shiftRole === shift.id) return true;
    if (task.assigneeId === personId && !task.shiftRole) return true;
    return false;
  }).map(task => ({
    ...task,
    status: getTaskStatus(task.id, dateKey),
    date: dateKey // Viktigt för att Admin-modalen ska veta vilken dag som redigeras
  }));

  return (
    <div className={cn(
      "p-2 relative flex flex-col gap-1.5",
      isRTL ? "border-l border-l-gray-100 last:border-l-0" : "border-r border-r-gray-100 last:border-r-0",
      isWeekend && "bg-gray-50/40",
      isToday && "bg-blue-50/30"
    )}>
      {dailyTasks.length > 0 ? (
        dailyTasks.slice(0, 4).map((task) => {
          const isDone = task.status === 'completed' || task.status === 'signed';
          const isMissed = task.status === 'missed';

          return (
            <div
              key={task.id}
              onClick={() => onTaskClick(task)}
              className={cn(
                "rounded px-2 py-1 text-[10px] border cursor-pointer hover:shadow-sm hover:scale-[1.01] transition-all truncate font-bold flex items-center gap-2",
                !isDone && !isMissed && getCategoryColor(task.category),
                isDone && "bg-green-50 border-green-200 text-green-700 opacity-70 grayscale-[0.2]",
                isMissed && "bg-red-50 border-red-300 text-red-700 ring-1 ring-red-200"
              )}
            >
              <div className={cn("w-1.5 h-1.5 rounded-full shrink-0",
                isDone ? "bg-green-500" :
                  isMissed ? "bg-red-500" :
                    task.category === 'hsl' ? 'bg-red-500' :
                      task.category === 'care' ? 'bg-blue-500' :
                        task.category === 'service' ? 'bg-orange-500' : 'bg-gray-500'
              )} />
              <span className={cn("truncate tracking-tight", isDone && "line-through")}>{task.title}</span>
            </div>
          );
        })
      ) : (
        <div className="flex-1 flex items-center justify-center text-[10px] text-gray-200 font-bold tracking-widest">
          -
        </div>
      )}

      {dailyTasks.length > 4 && (
        <div className="text-center text-[9px] text-municipal-600 font-black uppercase tracking-tighter cursor-pointer hover:underline">
          + {dailyTasks.length - 4} till
        </div>
      )}
    </div>
  );
};
