
import React, { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { STAFF } from '../../lib/demo-data';
import { cn, getShiftForDate, formatLocalDate } from '../../lib/utils';
import { TaskStatus, Task } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { translateTasks } from '../../lib/translations';

// Components
import { StaffHeader } from './components/StaffHeader';
import { TimelineView } from './components/TimelineView';
import { TaskSheet } from './components/TaskSheet';
import { ReportView } from './components/ReportView';
import { LinksView } from './components/LinksView';
import { ContactsView } from './components/ContactsView';
import { SbarView } from './components/SbarView';

export default function PersonalPage() {
  const { user: currentUser, logout } = useAuth();
  const { tasks, updateTask, getTaskStatus, loadDay } = useTasks();

  // Safe guard if user is not loaded yet (should be covered by RequireAuth but good for types)
  if (!currentUser) return null;

  const [activeTab, setActiveTab] = useState<'today' | 'report' | 'links' | 'contacts' | 'sbar'>('today');
  const [showVikarieMode, setShowVikarieMode] = useState(false);
  const [activeLang, setActiveLang] = useState('sv');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  // Admin Impersonation
  const [viewAsUserId, setViewAsUserId] = useState<string | null>(null);
  const location = useLocation();
  const adminUnitId = location.state?.unitId as string | undefined;

  // Initialize viewAsUserId with current user id
  // If we have an adminUnitId, find the first staff in that unit as default? Or just keep currentUser?
  // User asked for "users... should be that unit you were on", so maybe default to first user in that unit if currentUser is not in it?
  // For now, let's just use currentUser as default, but filter correctly.
  useEffect(() => {
    if (currentUser && !viewAsUserId) {
      setViewAsUserId(currentUser.id);
    }
  }, [currentUser, viewAsUserId]);

  // Derived effective user (who we are viewing as)
  const effectiveUser = useMemo(() => {
    if (currentUser.role === 'admin' && viewAsUserId) {
      // Find the selected user in STAFF list to get full Person object (with unitId etc)
      return STAFF.find(s => s.id === viewAsUserId) || currentUser;
    }
    return currentUser;
  }, [currentUser, viewAsUserId]);

  const dateKey = formatLocalDate(currentDate);

  useEffect(() => {
    if (effectiveUser?.unitId) {
      loadDay(dateKey, effectiveUser.unitId);
    }
  }, [loadDay, dateKey, effectiveUser.unitId]);

  // Filter staff based on admin unit selection
  const visibleStaff = useMemo(() => {
    if (!adminUnitId) return STAFF;
    return STAFF.filter(s => s.unitId === adminUnitId);
  }, [adminUnitId]);

  // --- FILTER & SORT LOGIC ---
  const dailyTasks = useMemo(() => {
    const shift = getShiftForDate(effectiveUser.id, currentDate, activeLang);
    if (shift.type === 'off') return [];

    const filtered = tasks.filter((task) => {
      // Rule 1: Always show if explicitly assigned to this user
      if (task.assigneeId === effectiveUser.id) return true;

      // Rule 2: Must be correct unit for other checks
      const isCorrectUnit = !task.unitId || task.unitId === effectiveUser.unitId;
      if (!isCorrectUnit) return false;

      // Rule 3: Match shift role
      if (task.shiftRole === shift.id) return true;

      return false;
    });

    const translated = translateTasks(filtered, activeLang);

    // Mappa effektiv status för den specifika dagen
    const tasksWithStatus = translated.map(task => ({
      ...task,
      status: getTaskStatus(task.id, dateKey)
    }));

    // TIDSSORTERING
    return [...tasksWithStatus].sort((a, b) => {
      const getNorm = (t: string) => {
        const [h, m] = t.split(':').map(Number);
        return h < 7 ? h + 24 : h;
      };
      const timeA = getNorm(a.timeStart) * 60 + parseInt(a.timeStart.split(':')[1]);
      const timeB = getNorm(b.timeStart) * 60 + parseInt(b.timeStart.split(':')[1]);
      return timeA - timeB;
    });
  }, [tasks, currentDate, effectiveUser.id, activeLang, effectiveUser.unitId, dateKey, getTaskStatus]);

  const handleNavigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
    setCurrentDate(newDate);
  };

  const handleNavigateToday = () => {
    setCurrentDate(new Date());
  };

  const toggleTaskStatus = (taskId: string) => {
    const task = dailyTasks.find(t => t.id === taskId);
    if (!task) return;

    let newStatus: TaskStatus;

    if (task.status === TaskStatus.COMPLETED || task.status === TaskStatus.SIGNED) {
      newStatus = TaskStatus.PENDING;
    } else {
      newStatus = task.requiresSign ? TaskStatus.SIGNED : TaskStatus.COMPLETED;
    }

    // Uppdatera med datum för att göra status unik för denna dag
    updateTask(taskId, { status: newStatus }, dateKey);
    setSelectedTask(null);
  };

  const handleLangChange = (lang: string) => {
    setActiveLang(lang);
  };

  const completedCount = dailyTasks.filter(t => t.status === TaskStatus.COMPLETED || t.status === TaskStatus.SIGNED).length;
  const progress = dailyTasks.length > 0 ? Math.round((completedCount / dailyTasks.length) * 100) : 0;

  const currentShift = getShiftForDate(effectiveUser.id, currentDate, activeLang);

  const t = {
    vikarieMode: activeLang === 'sv' ? 'Vikarieläge' : activeLang === 'en' ? 'Substitute Mode' : activeLang === 'es' ? 'Modo Suplente' : 'وضع البديل',
    shift: activeLang === 'sv' ? 'Pass' : activeLang === 'en' ? 'Shift' : activeLang === 'es' ? 'Turno' : 'وردية',
    noTasks: activeLang === 'sv' ? 'Inga uppgifter planerade för denna dag.' : activeLang === 'en' ? 'No tasks planned for this day.' : activeLang === 'es' ? 'No hay tareas planificadas för hoy.' : 'لا توجد مهام مخططة لهذا اليوم.',
    youAreOff: activeLang === 'sv' ? 'Du är ledig!' : activeLang === 'en' ? 'You are off!' : activeLang === 'es' ? '¡Estás libre!' : 'أنت في عطلة!',
    logout: activeLang === 'sv' ? 'Logga ut' : activeLang === 'en' ? 'Log out' : activeLang === 'es' ? 'Cerrar sesión' : 'تسجيل الخروج'
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 max-w-md mx-auto shadow-2xl overflow-hidden relative flex flex-col" dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>

      <StaffHeader
        user={effectiveUser}
        progress={progress}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeLang={activeLang}
        onLangChange={handleLangChange}
        currentDate={currentDate}
        onNavigateDate={handleNavigateDate}
        onNavigateToday={handleNavigateToday}
        isAdmin={currentUser.role === 'admin'}
        allStaff={visibleStaff}
        onSelectStaff={setViewAsUserId}
      />

      {activeTab === 'today' && (
        <div className="px-6 py-3 flex items-center justify-between bg-white border-b border-gray-100 shadow-sm z-0">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{t.vikarieMode}</span>
            <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
              {t.shift}: <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-bold", currentShift.color)}>{currentShift.label}</span>
            </span>
          </div>
          <button
            onClick={() => setShowVikarieMode(!showVikarieMode)}
            className={cn("w-10 h-6 rounded-full transition-colors flex items-center p-1 focus:outline-none", showVikarieMode ? "bg-municipal-600" : "bg-gray-300")}
          >
            <div className={cn("w-4 h-4 rounded-full bg-white shadow-sm transition-transform", showVikarieMode ? "translate-x-4" : "translate-x-0")}></div>
          </button>
        </div>
      )}

      <main className="px-4 py-6 space-y-4 flex-1 bg-[#f8fafc] overflow-y-auto">
        {activeTab === 'today' ? (
          <TimelineView
            tasks={dailyTasks}
            showVikarieMode={showVikarieMode}
            activeLang={activeLang}
            onTaskClick={setSelectedTask}
          />
        ) : activeTab === 'report' ? (
          <ReportView />
        ) : activeTab === 'links' ? (
          <LinksView activeLang={activeLang} />
        ) : activeTab === 'contacts' ? (
          <ContactsView activeLang={activeLang} />
        ) : (
          <SbarView activeLang={activeLang} />
        )}

        {activeTab === 'today' && dailyTasks.length === 0 && (
          <div className="text-center py-10 opacity-50 flex flex-col items-center gap-2">
            <p>{t.noTasks}</p>
            {currentShift.type === 'off' && <span className="text-sm font-bold bg-gray-200 px-3 py-1 rounded-full text-gray-600">{t.youAreOff}</span>}
          </div>
        )}
      </main>

      <TaskSheet
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onToggleStatus={toggleTaskStatus}
        showVikarieMode={showVikarieMode}
        activeLang={activeLang}
        date={dateKey}
      />

      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-around max-w-md mx-auto z-50">
        {currentUser.role === 'admin' ? (
          <Link to="/admin" className="p-2 text-municipal-600 hover:text-municipal-800 flex flex-col items-center w-full">
            <ChevronLeft size={20} className={activeLang === 'ar' ? 'rotate-180' : ''} />
            <span className="text-[10px] font-bold">Admin Dashboard</span>
          </Link>
        ) : (
          <button onClick={logout} className="p-2 text-gray-400 hover:text-municipal-600 flex flex-col items-center w-full">
            <ChevronLeft size={20} className={activeLang === 'ar' ? 'rotate-180' : ''} />
            <span className="text-[10px] font-medium">{t.logout}</span>
          </button>
        )}
      </div>
    </div>
  );
}
