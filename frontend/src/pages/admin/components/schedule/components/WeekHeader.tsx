
import React from 'react';
import { CalendarDays, ListChecks } from 'lucide-react';
import { cn } from '../../../../../lib/utils';

interface WeekHeaderProps {
  isRTL: boolean;
  activeLang: string;
  staffCount: number;
  viewType: 'shifts' | 'tasks';
  setViewType: (type: 'shifts' | 'tasks') => void;
  weekDays: Date[];
  dayNames: string[];
  onDayClick: (date: Date) => void;
}

export const WeekHeader: React.FC<WeekHeaderProps> = ({
  isRTL,
  activeLang,
  staffCount,
  viewType,
  setViewType,
  weekDays,
  dayNames,
  onDayClick,
}) => {
  return (
    <div className="grid grid-cols-[200px_repeat(7,1fr)] border-b border-gray-200 bg-gray-50 sticky top-0 z-20 shadow-sm">
      <div className={cn("p-3 font-bold text-gray-500 text-xs uppercase tracking-wider flex flex-col justify-center gap-2", isRTL ? "border-l border-l-gray-300" : "border-r border-r-gray-300")}>
        <span>{activeLang === 'ar' ? 'الموظفين' : activeLang === 'en' ? 'Staff' : 'PERSONAL'} ({staffCount})</span>
        
        <div className="flex bg-gray-200 rounded p-0.5 w-fit shadow-inner">
          <button 
            onClick={() => setViewType('shifts')}
            className={cn(
              "p-1 rounded flex items-center gap-1.5 text-[10px] font-bold transition-all",
              viewType === 'shifts' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
            title="Visa Arbetspass"
          >
            <CalendarDays size={12} /> {activeLang === 'ar' ? 'ورديات' : 'PASS'}
          </button>
          <button 
            onClick={() => setViewType('tasks')}
            className={cn(
              "p-1 rounded flex items-center gap-1.5 text-[10px] font-bold transition-all",
              viewType === 'tasks' ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
            )}
            title="Visa Uppgifter"
          >
            <ListChecks size={12} /> {activeLang === 'ar' ? 'مهام' : 'UPPG.'}
          </button>
        </div>
      </div>

      {weekDays.map((d, index) => {
        const isToday = d.toDateString() === new Date().toDateString();
        return (
          <button 
            key={index} 
            onClick={() => onDayClick(d)}
            className={cn(
              "group p-2 text-center hover:bg-white transition-colors cursor-pointer relative focus:outline-none flex flex-col justify-center items-center h-full",
              isRTL ? "border-l border-l-gray-200 last:border-l-0" : "border-r border-r-gray-200 last:border-r-0",
              isToday 
                ? "bg-blue-50 border-t-4 border-t-municipal-600 ring-inset ring-2 ring-municipal-500/20" 
                : "border-t-4 border-t-transparent"
            )}
          >
            {isToday && (
              <span className="text-[9px] font-extrabold text-municipal-600 uppercase tracking-widest mb-0.5 animate-pulse">
                {activeLang === 'ar' ? 'اليوم' : activeLang === 'en' ? 'Today' : 'Idag'}
              </span>
            )}
            <div className={cn("font-bold text-sm", isToday ? "text-municipal-800 scale-105" : "text-gray-900")}>
              {dayNames[index]}
            </div>
            <div className={cn("text-xs", isToday ? "text-municipal-700 font-bold" : "text-gray-400")}>
              {d.getDate()}/{d.getMonth() + 1}
            </div>
          </button>
        );
      })}
    </div>
  );
};
