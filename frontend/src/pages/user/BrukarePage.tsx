
import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { TaskStatus } from '../../types';
import { useTasks } from '../../context/TaskContext';
import { formatLocalDate } from '../../lib/utils';

// Components
import { UserHeader } from './components/UserHeader';
import { CurrentTaskCard } from './components/CurrentTaskCard';
import { StaffGrid } from './components/StaffGrid';
import { UpcomingTasksList } from './components/UpcomingTasksList';

export default function BrukarePage() {
  const { user: me, staff } = useAuth();
  const { tasks, getTaskStatus } = useTasks();

  if (!me) return null;

  const dateKey = formatLocalDate(new Date());

  // Simulate data fetching logic
  const currentTask = tasks.find(task => task.recipientId === me.id && getTaskStatus(task.id, dateKey) === TaskStatus.PENDING) || tasks.find(task => task.recipientId === me.id);
  const nextTasks = tasks.filter(task => {
    if (task.recipientId !== me.id) return false;
    if (!currentTask) return true;
    return task.id !== currentTask.id;
  });

  const staffToday = (staff ?? []).filter(
    staffMember => staffMember.unitId === me.unitId && (staffMember.role === 'staff' || staffMember.role === 'personal')
  );

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
