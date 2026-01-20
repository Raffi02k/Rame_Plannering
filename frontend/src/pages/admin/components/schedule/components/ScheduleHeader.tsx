
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { cn } from '../../../../../lib/utils';

interface ScheduleHeaderProps {
  gridTemplateColumns: string;
  isRTL: boolean;
  workingStaffCount: number;
  activeLang: string;
  viewPeriod: 'day' | 'night';
  setViewPeriod: (p: 'day' | 'night') => void;
  hours: number[];
  isToday: boolean;
  nowHour: number;
  justNuLabel: string;
}

export const ScheduleHeader: React.FC<ScheduleHeaderProps> = ({
  gridTemplateColumns,
  isRTL,
  workingStaffCount,
  activeLang,
  viewPeriod,
  setViewPeriod,
  hours,
  isToday,
  nowHour,
  justNuLabel,
}) => {
  return (
    <div className="sticky top-0 z-[115] bg-gray-100 border-b border-gray-300 h-12 grid" style={{ gridTemplateColumns }}>
      <div
        className={cn(
          "sticky z-[120] bg-gray-100 px-4 py-1 text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between shadow-[4px_0_8px_rgba(0,0,0,0.05)]",
          isRTL ? "right-0 border-l border-l-gray-300" : "left-0 border-r border-r-gray-300"
        )}
      >
        <span className="truncate">
          {workingStaffCount} {activeLang === 'sv' ? 'PERS.' : 'STAFF'}
        </span>

        <div className="flex bg-gray-200 rounded p-0.5 ml-1">
          <button
            onClick={() => setViewPeriod('day')}
            className={cn(
              "p-1 rounded w-7 h-7 flex items-center justify-center transition-all",
              viewPeriod === 'day' ? "bg-white text-orange-500 shadow-sm" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <Sun size={14} />
          </button>
          <button
            onClick={() => setViewPeriod('night')}
            className={cn(
              "p-1 rounded w-7 h-7 flex items-center justify-center transition-all",
              viewPeriod === 'night' ? "bg-municipal-900 text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
            )}
          >
            <Moon size={14} />
          </button>
        </div>
      </div>

      {hours.map((hour, idx) => {
        const isCurrentHour = isToday && hour === nowHour;
        return (
          <div
            key={`${hour}-${idx}`}
            className={cn(
              "flex flex-col items-center justify-center text-[11px] font-bold border-l border-gray-200 relative",
              isCurrentHour
                ? "bg-blue-50 border-t-4 border-t-municipal-600 text-municipal-800 shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]"
                : "bg-gray-100 text-gray-400 border-t-4 border-t-transparent"
            )}
          >
            {isCurrentHour && (
              <span className="text-[8px] font-black text-municipal-600 uppercase tracking-tighter leading-none mb-0.5 animate-pulse">
                {justNuLabel}
              </span>
            )}
            {String(hour).padStart(2, '0')}:00
          </div>
        );
      })}
    </div>
  );
};
