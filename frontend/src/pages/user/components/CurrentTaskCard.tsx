
import React from 'react';
import { Utensils } from 'lucide-react';
import { Task } from '../../../types';

interface CurrentTaskCardProps {
  task?: Task | null;
}

export const CurrentTaskCard: React.FC<CurrentTaskCardProps> = ({ task }) => {
  if (!task) {
    return (
      <section>
        <h2 className="text-xl font-bold text-slate-400 mb-4 uppercase tracking-wider">Just nu</h2>
        <div className="bg-white rounded-3xl p-8 shadow-xl border-l-[12px] border-slate-200 flex items-center justify-center text-slate-500 font-semibold">
          Inga uppgifter just nu
        </div>
      </section>
    );
  }

  return (
    <section>
      <h2 className="text-xl font-bold text-slate-400 mb-4 uppercase tracking-wider">Just nu</h2>
      <div className="bg-white rounded-3xl p-8 shadow-xl border-l-[12px] border-municipal-500 flex flex-col md:flex-row gap-8 items-center md:items-start transform transition-transform hover:scale-[1.01]">
        <div className="w-32 h-32 rounded-2xl bg-municipal-100 flex items-center justify-center text-municipal-600 shrink-0">
           {/* Contextual Icon based on task - simplifying to Utensils for demo */}
           <Utensils size={64} /> 
        </div>
        <div className="flex-1 text-center md:text-left">
          <span className="inline-block px-4 py-2 bg-municipal-100 text-municipal-800 rounded-full font-bold text-xl mb-4">
            {task.timeStart}
          </span>
          <h3 className="text-4xl font-extrabold text-slate-900 mb-2 leading-tight">
            {task.title}
          </h3>
          <p className="text-xl text-slate-600">{task.description}</p>
        </div>
      </div>
    </section>
  );
};
