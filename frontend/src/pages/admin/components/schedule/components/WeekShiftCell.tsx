
import React from 'react';
import { Sun, Moon, Sunrise, Coffee } from 'lucide-react';
import { cn, getShiftForDate } from '../../../../../lib/utils';

interface WeekShiftCellProps {
  personId: string;
  day: Date;
  activeLang: string;
  isRTL: boolean;
  isWeekend: boolean;
  isToday: boolean;
}

export const WeekShiftCell: React.FC<WeekShiftCellProps> = ({
  personId,
  day,
  activeLang,
  isRTL,
  isWeekend,
  isToday,
}) => {
  const shift = getShiftForDate(personId, day, activeLang);
  
  const getShiftIcon = (type: string) => {
    switch(type) {
      case 'day': return Sun;
      case 'eve': return Sunrise;
      case 'night': return Moon;
      default: return Coffee;
    }
  };

  const Icon = getShiftIcon(shift.type);

  return (
    <div className={cn(
      "p-2 flex flex-col justify-center", 
      isRTL ? "border-l border-l-gray-100 last:border-l-0" : "border-r border-r-gray-100 last:border-r-0",
      isWeekend && "bg-gray-50/40",
      isToday && "bg-blue-50/30" 
    )}>
      {shift.type !== 'off' ? (
        <div className={cn("w-full h-full rounded-lg border p-2 flex flex-col items-center justify-center gap-1 text-center transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer", shift.color)}>
           <div className="flex items-center gap-1.5 font-bold text-[11px] leading-tight">
              {Icon && <Icon size={12} />}
              <span>{shift.label}</span>
           </div>
           <div className="text-[9px] font-mono opacity-80">{shift.time}</div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-300 text-[10px] font-bold italic tracking-tight uppercase">
          {shift.label}
        </div>
      )}
    </div>
  );
};
