
import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '../../components/Button';
import { translateTasks, getUITranslations } from '../../lib/translations';
import { getShiftForDate, formatLocalDate } from '../../lib/utils';
import { Task, TaskStatus, TaskCategory } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';

// Logic
import { calculateMissedTasks, MissedTaskInfo } from './logic/missedTaskHelpers';
import { useWeekDays } from './components/schedule/hooks/useWeekDays';

// Sub-components
import { AdminHeader } from './components/AdminHeader';
import { MissedTaskAlert } from './components/MissedTaskAlert';
import { DaySchedule } from './components/DaySchedule';
import { WeekSchedule } from './components/WeekSchedule';
import { TaskModal } from './modals/TaskModal';
import { ReportModal } from './modals/ReportModal';
import { FilterBar } from './components/FilterBar';
import { LoadingScreen } from '../../components/LoadingScreen';

export default function AdminPage() {
  // State
  const { user: currentUser, logout, staff, units, users } = useAuth();
  const staffList = staff ?? [];
  const unitsList = units ?? [];
  const usersList = users ?? [];
  const [currentUnitId, setCurrentUnitId] = useState('');
  const [viewMode, setViewMode] = useState<'day' | 'week'>('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  const dayShiftIds = ['morning_red', 'morning_blue', 'admin_day', 'dev_alpha', 'dev_beta', 'dev_gamma', 'dev_delta'];
  const eveningShiftIds = ['evening_red', 'evening_blue'];
  const nightShiftIds = ['night_red', 'night_blue'];


  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isReportModalOpen, setReportModalOpen] = useState(false);

  const { tasks: globalTasks, updateTask: globalUpdateTask, addTask: globalAddTask, deleteTask: globalDeleteTask, getTaskStatus, loadDay, isLoading: isTasksLoading } = useTasks();

  // Load data when date/unit changes
  React.useEffect(() => {
    const dateKey = formatLocalDate(currentDate);
    if (loadDay && currentUnitId) {
      loadDay(dateKey, currentUnitId);
    }
  }, [currentDate, currentUnitId, loadDay]);

  const [currentTask, setCurrentTask] = useState<Partial<Task> | null>(null);
  const [activeLang, setActiveLang] = useState('sv');

  const [activeFilters, setActiveFilters] = useState<TaskCategory[]>([]);
  const [activeStaffFilters, setActiveStaffFilters] = useState<string[]>([]);
  const [activeShiftFilters, setActiveShiftFilters] = useState<string[]>([]);

  const t = getUITranslations(activeLang);
  const weekDays = useWeekDays(currentDate);

  const isStaffRole = (role?: string) => role === 'staff' || role === 'personal';
  const allUnitStaff = useMemo(
    () => staffList.filter(s => s.unitId === currentUnitId && isStaffRole(s.role)),
    [currentUnitId, staffList]
  );

  const visibleStaff = useMemo(() => {
    let list = allUnitStaff;

    if (activeShiftFilters.length > 0) {
      list = list.filter(person => {
        const shift = getShiftForDate(person.id, currentDate, activeLang, staffList);
        const isDay = activeShiftFilters.includes('day') && dayShiftIds.includes(shift.id);
        const isEve = activeShiftFilters.includes('evening') && eveningShiftIds.includes(shift.id);
        const isNight = activeShiftFilters.includes('night') && nightShiftIds.includes(shift.id);
        return isDay || isEve || isNight;
      });
    }

    if (activeStaffFilters.length > 0) {
      list = list.filter(s => activeStaffFilters.includes(s.id));
    }

    return list;
  }, [allUnitStaff, activeStaffFilters, activeShiftFilters, currentDate, activeLang, staffList]);

  const filteredTasks = useMemo(() => {
    let tasks = globalTasks.filter(t => t.unitId === currentUnitId || !t.unitId);

    if (activeFilters.length > 0) {
      tasks = tasks.filter(t => activeFilters.includes(t.category));
    }

    if (activeShiftFilters.length > 0) {
      tasks = tasks.filter(task => {
        if (!task.shiftRole) return false;
        const isDay = activeShiftFilters.includes('day') && dayShiftIds.includes(task.shiftRole);
        const isEve = activeShiftFilters.includes('evening') && eveningShiftIds.includes(task.shiftRole);
        const isNight = activeShiftFilters.includes('night') && nightShiftIds.includes(task.shiftRole);
        return isDay || isEve || isNight;
      });
    }

    const translated = translateTasks(tasks, activeLang);

    if (viewMode === 'day') {
      const dateKey = formatLocalDate(currentDate);
      return translated.map(task => ({
        ...task,
        status: getTaskStatus(task.id, dateKey),
        date: dateKey
      }));
    }

    return translated;
  }, [currentUnitId, activeFilters, activeShiftFilters, globalTasks, activeLang, viewMode, currentDate, getTaskStatus]);

  // BERÄKNA MISSADE UPPGIFTER DYNAMISKT
  const missedTasks = useMemo(() => {
    const datesToInquire = viewMode === 'day' ? [currentDate] : weekDays;
    return calculateMissedTasks(datesToInquire, globalTasks, allUnitStaff, getTaskStatus, activeLang);
  }, [viewMode, currentDate, weekDays, globalTasks, allUnitStaff, getTaskStatus, activeLang]);

  const missedDescription = useMemo(() => {
    if (missedTasks.length === 0) return null;
    if (activeLang === 'sv') {
      return `${missedTasks.length} ${missedTasks.length === 1 ? 'uppgift' : 'uppgifter'} registrerades ej som klara under den valda perioden.`;
    }
    if (activeLang === 'es') {
      return `${missedTasks.length} ${missedTasks.length === 1 ? 'tarea' : 'tareas'} no se registraron como completadas durante el período seleccionado.`;
    }
    if (activeLang === 'ar') {
      return `${missedTasks.length} ${missedTasks.length === 1 ? 'مهمة' : 'مهام'} لم يتم تسجيلها كمكتملة خلال الفترة المحددة.`;
    }
    return `${missedTasks.length} ${missedTasks.length === 1 ? 'task was' : 'tasks were'} not registered as completed during the selected period.`;
  }, [missedTasks, activeLang]);

  const handleEditTask = (task: Task) => {
    setCurrentTask(task);
    setTaskModalOpen(true);
  };

  const handleNewTask = () => {
    setCurrentTask({
      unitId: currentUnitId,
      assigneeId: visibleStaff[0]?.id || allUnitStaff[0]?.id,
      timeStart: '08:00',
      timeEnd: '09:00',
      status: TaskStatus.PENDING,
      category: TaskCategory.CARE
    });
    setTaskModalOpen(true);
  };

  const saveTask = (taskData: Partial<Task>) => {
    if (taskData.id) {
      const dateKey = taskData.date || formatLocalDate(currentDate);
      globalUpdateTask(taskData.id, taskData, dateKey);
    } else {
      const newTask = {
        ...taskData,
        id: Math.random().toString(36).substr(2, 9),
        unitId: currentUnitId
      } as Task;
      globalAddTask(newTask);
    }
    setTaskModalOpen(false);
  };

  const handleDeleteTask = (id: string) => {
    globalDeleteTask(id);
    setTaskModalOpen(false);
  };

  const toggleFilter = (cat: TaskCategory) => {
    setActiveFilters(prev => prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]);
  };

  const toggleShiftFilter = (shift: string) => {
    setActiveShiftFilters(prev => prev.includes(shift) ? prev.filter(s => s !== shift) : [...prev, shift]);
  };

  const toggleStaffFilter = (staffId: string) => {
    setActiveStaffFilters(prev => prev.includes(staffId) ? prev.filter(id => id !== staffId) : [...prev, staffId]);
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    setActiveStaffFilters([]);
    setActiveShiftFilters([]);
  };

  const navigateDate = (direction: 'prev' | 'next' | 'today') => {
    const newDate = new Date(currentDate);
    if (direction === 'today') {
      setCurrentDate(new Date());
      return;
    }
    const daysToAdd = viewMode === 'week' ? 7 : 1;
    const modifier = direction === 'next' ? 1 : -1;
    newDate.setDate(newDate.getDate() + (daysToAdd * modifier));
    setCurrentDate(newDate);
  };

  const hasActiveFilters = activeFilters.length > 0 || activeStaffFilters.length > 0 || activeStaffFilters.length > 0;

  React.useEffect(() => {
    if (currentUnitId || unitsList.length === 0) return;
    setCurrentUnitId(unitsList[0].id);
  }, [currentUnitId, unitsList]);

  const currentUnitName =
    unitsList.find(u => u.id === currentUnitId)?.name || currentUnitId;

  if (isTasksLoading || !currentUnitId) {
    return <LoadingScreen label="Laddar schema" />;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-900" dir={activeLang === 'ar' ? 'rtl' : 'ltr'}>
      <AdminHeader
        units={unitsList}
        currentUnitId={currentUnitId}
        onUnitChange={setCurrentUnitId}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        activeLang={activeLang}
        onLangChange={setActiveLang}
        currentDate={currentDate}
        onNavigate={navigateDate}
      />

      <main className="flex-1 min-w-0 flex flex-col max-w-[1800px] mx-auto w-full px-4 sm:px-6 py-6">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            {currentUnitName}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <FilterBar
              activeLang={activeLang}
              activeFilters={activeFilters}
              toggleFilter={toggleFilter}
              activeShiftFilters={activeShiftFilters}
              toggleShiftFilter={toggleShiftFilter}
              allUnitStaff={allUnitStaff}
              activeStaffFilters={activeStaffFilters}
              toggleStaffFilter={toggleStaffFilter}
              clearAllFilters={clearAllFilters}
              hasActiveFilters={hasActiveFilters}
            />
            <Button onClick={handleNewTask} className="shadow-lg shadow-municipal-500/20 gap-2 text-sm h-10 px-4 whitespace-nowrap">
              <Plus size={16} /> {t.newTask}
            </Button>
          </div>
        </div>

        {missedTasks.length > 0 && (
          <MissedTaskAlert
            title={t.missedTitle}
            description={missedDescription}
            buttonText={t.missedButton}
            onShowReport={() => setReportModalOpen(true)}
          />
        )}

        {viewMode === 'week' ? (
          <WeekSchedule currentDate={currentDate} staff={visibleStaff} tasks={filteredTasks} onTaskClick={handleEditTask} activeLang={activeLang} onDayClick={(date) => { setCurrentDate(date); setViewMode('day'); }} />
        ) : (
          <DaySchedule currentDate={currentDate} staff={visibleStaff} tasks={filteredTasks} onTaskClick={handleEditTask} activeLang={activeLang} />
        )}
      </main>

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        task={currentTask}
        staffList={visibleStaff.length > 0 ? visibleStaff : allUnitStaff}
        users={usersList}
        onSave={saveTask}
        onDelete={handleDeleteTask}
        date={currentDate}
        activeLang={activeLang}
      />
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setReportModalOpen(false)}
        missedTasks={missedTasks}
        activeLang={activeLang}
        isWeekView={viewMode === 'week'}
      />
    </div>
  );
}
