
import React, { useMemo, useState } from 'react';
import { getShiftForDate } from '../../../lib/utils';
import { Person, Task } from '../../../types';
import { getUITranslations } from '../../../lib/translations';

// Sub-components
import { ScheduleHeader } from './schedule/components/ScheduleHeader';
import { ScheduleGridBackground } from './schedule/components/ScheduleGridBackground';
import { StaffRow } from './schedule/components/StaffRow';

// Hooks
import { useNowHour } from './schedule/hooks/useNowHour';
import { useContainerWidth } from './schedule/hooks/useContainerWidth';
import { useScheduleLayout } from './schedule/hooks/useScheduleLayout';

interface DayScheduleProps {
  staff: Person[];
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  activeLang?: string;
  currentDate: Date;
}

const STAFF_WIDTH = 220;
const MIN_HOUR_WIDTH = 120;

export const DaySchedule: React.FC<DayScheduleProps> = ({
  staff,
  tasks,
  onTaskClick,
  activeLang = 'sv',
  currentDate,
}) => {
  const [viewPeriod, setViewPeriod] = useState<'day' | 'night'>('day');
  const nowHour = useNowHour();
  const { containerRef, containerWidth } = useContainerWidth();
  const isRTL = activeLang === 'ar';
  const t = getUITranslations(activeLang);

  const {
    startHour,
    endHour,
    totalHours,
    hours,
    hourWidth,
    timelineWidth,
    gridTemplateColumns,
    getNormalizedHour,
    getTaskStyle,
    getShiftBarStyle,
    getDurationMinutes,
  } = useScheduleLayout({
    viewPeriod,
    containerWidth,
    isRTL,
    STAFF_WIDTH,
    MIN_HOUR_WIDTH,
  });

  const isToday = new Date().toDateString() === currentDate.toDateString();

  const workingStaff = useMemo(() => {
    return staff.filter((person) => {
      const shift = getShiftForDate(person.id, currentDate, activeLang, staff);
      return shift.type !== 'off';
    });
  }, [staff, currentDate, activeLang]);

  const bodyMinHeight = Math.max(workingStaff.length * 140, 500);

  return (
    <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm flex flex-col h-[calc(100vh-220px)] min-h-[500px] overflow-hidden relative z-0">
      <div
        ref={containerRef}
        className="overflow-x-auto overflow-y-auto flex-1 relative bg-gray-50/5 schedule-scroll-container"
        style={{ overscrollBehaviorX: 'contain' }}
      >
        <div
          style={{ width: `${Math.max(STAFF_WIDTH + timelineWidth, containerWidth)}px` }}
          className="flex flex-col min-h-full"
        >
          <ScheduleHeader
            gridTemplateColumns={gridTemplateColumns}
            isRTL={isRTL}
            workingStaffCount={workingStaff.length}
            activeLang={activeLang}
            viewPeriod={viewPeriod}
            setViewPeriod={setViewPeriod}
            hours={hours}
            isToday={isToday}
            nowHour={nowHour}
            justNuLabel={t.justNu}
          />

          <div className="relative bg-white flex-1" style={{ minHeight: bodyMinHeight }}>
            <ScheduleGridBackground
              gridTemplateColumns={gridTemplateColumns}
              isRTL={isRTL}
              hours={hours}
              isToday={isToday}
              nowHour={nowHour}
            />

            {workingStaff.map((person) => (
              <StaffRow
                key={`${person.id}-${currentDate.getTime()}`}
                person={person}
                staffList={staff}
                tasks={tasks}
                currentDate={currentDate}
                activeLang={activeLang}
                gridTemplateColumns={gridTemplateColumns}
                isRTL={isRTL}
                totalHours={totalHours}
                getShiftBarStyle={getShiftBarStyle}
                getTaskStyle={getTaskStyle}
                getDurationMinutes={getDurationMinutes}
                onTaskClick={onTaskClick}
                startHour={startHour}
                endHour={endHour}
                getNormalizedHour={getNormalizedHour}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .schedule-scroll-container::-webkit-scrollbar { height: 10px; }
        .schedule-scroll-container::-webkit-scrollbar-track { background: #f8fafc; }
        .schedule-scroll-container::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; border: 2px solid #f8fafc; }
        .schedule-scroll-container {
          scrollbar-color: #cbd5e1 #f8fafc;
          scrollbar-width: thin;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
};
