
import React from 'react';
import { Clock, Check } from 'lucide-react';
import { cn, getCategoryColor } from '../../../../../lib/utils';
import { Task, TaskStatus } from '../../../../../types';

interface TaskCardProps {
  task: Task;
  onTaskClick: (task: Task) => void;
  getTaskStyle: (task: Task) => React.CSSProperties;
  getDurationMinutes: (task: Task) => number;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onTaskClick,
  getTaskStyle,
  getDurationMinutes,
}) => {
  const duration = getDurationMinutes(task);
  const isTiny = duration < 60;
  const isSignedOrDone = task.status === TaskStatus.COMPLETED || task.status === TaskStatus.SIGNED;

  return (
    <div
      onClick={() => onTaskClick(task)}
      className={cn(
        'absolute rounded border border-l-[4px] shadow-sm cursor-pointer transition-all bg-white group/task overflow-hidden',
        !isSignedOrDone && getCategoryColor(task.category),
        isSignedOrDone && 'bg-green-50/70 border-green-200 border-l-green-500 opacity-90 grayscale-[0.2]',
        task.status === TaskStatus.MISSED && 'ring-2 ring-red-500 bg-red-50 border-red-300',
        isTiny
          ? 'hover:!w-[260px] hover:!h-auto hover:!z-[100] hover:shadow-2xl hover:overflow-visible'
          : 'hover:shadow-lg hover:z-50 hover:scale-[1.01]'
      )}
      style={getTaskStyle(task)}
    >
      {isSignedOrDone && (
        <Check className="absolute -right-2 -bottom-2 text-green-200/40 w-16 h-16 -rotate-12 pointer-events-none" strokeWidth={4} />
      )}

      <div className={cn("flex flex-col h-full relative z-10", isTiny ? "p-1.5" : "p-2", isTiny && "group-hover/task:p-3")}>
        <div className="flex justify-between items-start mb-0.5">
          <div className={cn("flex items-center gap-1 font-bold font-mono text-[9px] truncate", isSignedOrDone ? "text-green-700/60" : "opacity-60")}>
            <Clock size={10} className="shrink-0" />
            <span>{task.timeStart}-{task.timeEnd}</span>
          </div>
          {isSignedOrDone && (
            <div className="bg-green-600 rounded-full p-0.5 shadow-sm">
              <Check size={10} className="text-white" strokeWidth={4} />
            </div>
          )}
        </div>

        <div
          className={cn(
            "font-bold leading-tight truncate",
            isSignedOrDone ? "text-gray-500 italic" : "text-gray-900",
            isTiny
              ? "text-[10px] group-hover/task:text-sm group-hover/task:whitespace-normal"
              : "text-[11px]"
          )}
        >
          {task.title}
        </div>

        {task.description && (
          <div
            className={cn(
              "text-[10px] mt-0.5 leading-tight opacity-90 group-hover/task:opacity-100 transition-opacity",
              isSignedOrDone ? "text-gray-400 line-through" : "text-gray-500",
              isTiny ? "line-clamp-1 group-hover/task:line-clamp-none" : "line-clamp-2"
            )}
          >
            {task.description}
          </div>
        )}
      </div>
    </div>
  );
};
