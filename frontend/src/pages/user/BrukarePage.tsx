
import React from 'react';
import { STAFF, TASKS, USERS } from '../../lib/demo-data';
import { TaskStatus } from '../../types';

// Components
import { UserHeader } from './components/UserHeader';
import { CurrentTaskCard } from './components/CurrentTaskCard';
import { StaffGrid } from './components/StaffGrid';
import { UpcomingTasksList } from './components/UpcomingTasksList';

export default function BrukarePage() {
  const me = USERS[0]; // Anna
  
  // Simulate data fetching logic
  const currentTask = TASKS.find(t => t.recipientId === me.id && t.status === TaskStatus.PENDING) || TASKS[0];
  const nextTasks = TASKS.filter(t => t.recipientId === me.id && t.id !== currentTask.id);
  const staffToday = STAFF.filter(s => s.id === 's1' || s.id === 's3'); // Fake logic for who is working

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 pb-10">
      
      <UserHeader user={me} />

      <main className="max-w-3xl mx-auto p-6 space-y-8 animate-fade-in">
        
        <CurrentTaskCard task={currentTask} />

        <StaffGrid staff={staffToday} />

        <UpcomingTasksList tasks={nextTasks} />
      
      </main>
    </div>
  );
}
