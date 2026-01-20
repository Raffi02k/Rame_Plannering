import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Task, TaskStatus, Report } from '../types';
import { api } from '../api/client';

interface TaskContextType {
  tasks: Task[];
  updateTask: (taskId: string, updates: Partial<Task>, date?: string) => void;
  getTaskStatus: (taskId: string, date: string) => TaskStatus;
  addTask: (task: Task) => void;
  deleteTask: (taskId: string) => void;
  loadDay: (date: string, unitId: string) => Promise<void>;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  // const [reports, setReports] = useState<Report[]>([]); // Removed: using task.reportData instead
  const [instanceStatuses, setInstanceStatuses] = useState<Record<string, TaskStatus>>({});

  const loadDay = React.useCallback(async (date: string, unitId: string) => {
    try {
      const data = await api.getDaySchedule(unitId, date);

      if (!data || !Array.isArray(data.tasks)) {
        console.warn("Invalid data format received from API:", data);
        setTasks([]);
        return;
      }

      // The API returns tasks with their status for the day.
      // We map this to our internal state.
      // API 'tasks' combine template info + status.
      // Our frontend splits 'tasks' (templates) and 'instanceStatuses' (status).
      // But simplifying: let's just use the API tasks as the source of truth for the list,
      // and populate instanceStatuses for compatibility.

      const loadedTasks: Task[] = data.tasks.map((t: any) => ({
        id: t.id,
        unitId: unitId, // Ensure unitId is correct
        title: t.title,
        description: t.description,
        category: t.category?.toLowerCase(),
        substituteInstructions: t.substituteInstructions,
        timeStart: t.meta?.timeStart,
        timeEnd: t.meta?.timeEnd,
        shiftRole: t.roleType,
        requiresSign: t.meta?.requiresSign,
        isReportTask: t.meta?.isReportTask,
        reportType: t.meta?.reportType,
        reportData: t.reportData, // Map from API
        validOnDate: t.validOnDate, // Map from API
        assigneeId: t.assigneeId // Map from API
      }));

      setTasks(loadedTasks);

      // Update statuses map
      const newStatuses: Record<string, TaskStatus> = {};
      data.tasks.forEach((t: any) => {
        if (t.status) {
          newStatuses[`${t.id}:${date}`] = t.status as TaskStatus;
        }
      });
      setInstanceStatuses(prev => ({ ...prev, ...newStatuses }));

    } catch (e) {
      console.error("Failed to load tasks", e);
      setTasks([]); // Clear tasks on error to prevent stale state issues
    }
  }, []);

  const getTaskStatus = React.useCallback((taskId: string, date: string) => {
    return instanceStatuses[`${taskId}:${date}`] || TaskStatus.PENDING;
  }, [instanceStatuses]);

  const updateTask = React.useCallback((taskId: string, updates: Partial<Task>, date?: string) => {
    if (date && updates.status) {
      // Optimistic update
      setInstanceStatuses(prev => ({
        ...prev,
        [`${taskId}:${date}`]: updates.status as TaskStatus
      }));

      // Also update local task state for reportData
      if (updates.reportData) {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updates } : t));
      }

      // Call API
      api.updateTaskStatus(taskId, {
        date: date,
        status: updates.status,
        signed_by: 's1', // Hardcoded signer for prototype
        signed_at: new Date().toISOString(),
        reportData: updates.reportData
      }).catch(err => console.error("Failed to update task", err));
    }
  }, []);

  const addTask = React.useCallback(async (task: Task) => {
    try {
      const res = await api.createTask(task);
      if (res && res.id) {
        setTasks(prev => [...prev, { ...task, id: res.id }]);
      }
    } catch (e) {
      console.error("Failed to create task", e);
    }
  }, []);

  const deleteTask = React.useCallback(async (taskId: string) => {
    try {
      await api.deleteTask(taskId);
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (e) {
      console.error("Failed to delete task", e);
    }
  }, []);

  // addOrUpdateReport removed

  const value = React.useMemo(() => ({
    tasks,
    updateTask,
    getTaskStatus,
    addTask,
    deleteTask,
    loadDay
  }), [tasks, updateTask, getTaskStatus, addTask, deleteTask, loadDay]);

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
