
import React from 'react';
import { cn } from '../../../../../lib/utils';

interface ScheduleGridBackgroundProps {
  gridTemplateColumns: string;
  isRTL: boolean;
  hours: number[];
  isToday: boolean;
  nowHour: number;
}

export const ScheduleGridBackground: React.FC<ScheduleGridBackgroundProps> = ({
  gridTemplateColumns,
  isRTL,
  hours,
  isToday,
  nowHour,
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 grid" style={{ gridTemplateColumns }}>
      <div className={cn("bg-white", isRTL ? "border-l border-l-gray-300" : "border-r border-r-gray-300")} />
      {hours.map((hour, idx) => {
        const isCurrentHour = isToday && hour === nowHour;
        return (
          <div
            key={idx}
            className={cn(
              "border-l border-gray-100 h-full",
              isCurrentHour && "bg-municipal-500/[0.03] border-l-municipal-200"
            )}
          />
        );
      })}
    </div>
  );
};
