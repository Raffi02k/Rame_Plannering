
import React from 'react';
import { cn } from '../../../lib/utils';
import { Person } from '../../../types';

interface StaffGridProps {
  staff: Person[];
}

export const StaffGrid: React.FC<StaffGridProps> = ({ staff }) => {
  return (
    <section>
      <h2 className="text-xl font-bold text-slate-400 mb-4 uppercase tracking-wider">Personal idag</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {staff.map(person => (
          <div key={person.id} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center text-center">
            <div className={cn("p-1 rounded-full border-4 mb-3", 
              person.teamColor === 'red' ? 'border-red-200' : 
              person.teamColor === 'blue' ? 'border-blue-200' : 'border-purple-200'
            )}>
              <img src={person.avatar} alt={person.name} className="w-20 h-20 rounded-full object-cover" />
            </div>
            <span className="font-bold text-lg text-slate-900">{person.name.split(' ')[0]}</span>
            <span className="text-slate-500">{person.role}</span>
          </div>
        ))}
      </div>
    </section>
  );
};
