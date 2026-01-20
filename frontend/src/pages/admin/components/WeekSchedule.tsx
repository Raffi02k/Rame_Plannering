
import React, { useState } from 'react';
import { Person, Task } from '../../../types';

// Hooks
import { useWeekDays } from './schedule/hooks/useWeekDays';
import { useWeekTranslations } from './schedule/hooks/useWeekTranslations';

// Components
import { WeekHeader } from './schedule/components/WeekHeader';
import { WeekStaffRow } from './schedule/components/WeekStaffRow';

interface WeekScheduleProps {
  currentDate: Date;
  staff: Person[];
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  activeLang?: string;
  onDayClick: (date: Date) => void;
}

type ViewType = 'shifts' | 'tasks';

export const WeekSchedule: React.FC<WeekScheduleProps> = ({ 
  currentDate,
  staff, 
  tasks, 
  onTaskClick,
  activeLang = 'sv',
  onDayClick
}) => {
  const [viewType, setViewType] = useState<ViewType>('shifts');
  const isRTL = activeLang === 'ar';
  
  const weekDays = useWeekDays(currentDate);
  const { dayNames } = useWeekTranslations(activeLang);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[calc(100vh-220px)]">
       <div className="overflow-auto flex flex-col h-full bg-gray-50/10">
         <div className="min-w-[1000px] flex flex-col min-h-full"> 
           
           <WeekHeader
             isRTL={isRTL}
             activeLang={activeLang}
             staffCount={staff.length}
             viewType={viewType}
             setViewType={setViewType}
             weekDays={weekDays}
             dayNames={dayNames}
             onDayClick={onDayClick}
           />

           <div className="divide-y divide-gray-100 bg-white">
             {staff.map(person => (
               <WeekStaffRow
                 key={person.id}
                 person={person}
                 weekDays={weekDays}
                 viewType={viewType}
                 tasks={tasks}
                 activeLang={activeLang}
                 isRTL={isRTL}
                 onTaskClick={onTaskClick}
               />
             ))}
           </div>
         </div>
       </div>
    </div>
  );
};
