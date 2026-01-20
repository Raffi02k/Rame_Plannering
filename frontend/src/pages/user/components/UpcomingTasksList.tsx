
import React from 'react';
import { Task } from '../../../types';

interface UpcomingTasksListProps {
  tasks: Task[];
}

export const UpcomingTasksList: React.FC<UpcomingTasksListProps> = ({ tasks }) => {
  return (
    <section>
      <h2 className="text-xl font-bold text-slate-400 mb-4 uppercase tracking-wider">Senare</h2>
      <div className="space-y-4">
        {tasks.slice(0, 3).map(task => (
          <div key={task.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-6 opacity-75 hover:opacity-100 transition-opacity">
            <div className="text-xl font-bold text-slate-400 w-16">{task.timeStart}</div>
            <div className="h-12 w-px bg-slate-100"></div>
            <div>
               <h4 className="text-xl font-bold text-slate-800">{task.title}</h4>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
