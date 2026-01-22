
import { Task, Person, TaskStatus } from '../../../types';
import { getShiftForDate, formatLocalDate } from '../../../lib/utils';

export interface MissedTaskInfo {
  title: string;
  staffName: string;
  time: string;
  date: string;
}

export const calculateMissedTasks = (
  dates: Date[],
  tasks: Task[],
  staff: Person[],
  getTaskStatus: (taskId: string, date: string) => TaskStatus,
  lang: string
): MissedTaskInfo[] => {
  const now = new Date();
  const missed: MissedTaskInfo[] = [];

  for (const d of dates) {
    const dateISO = formatLocalDate(d);
    const isPastDate = d.toDateString() !== now.toDateString() && d < now;
    const isToday = d.toDateString() === now.toDateString();

    for (const person of staff) {
      const shift = getShiftForDate(person.id, d, lang, staff);
      if (shift.type === 'off') continue;

      // Hämta alla tasks som denna person ansvarar för denna dag
      const personTasks = tasks.filter(t =>
        t.shiftRole === shift.id || (t.assigneeId === person.id && !t.shiftRole)
      );

      for (const task of personTasks) {
        const status = getTaskStatus(task.id, dateISO);
        if (status === TaskStatus.COMPLETED || status === TaskStatus.SIGNED) continue;

        // Beräkna om sluttiden har passerat
        const [endH, endM] = task.timeEnd.split(':').map(Number);
        const taskEndTime = new Date(d);
        taskEndTime.setHours(endH, endM, 0, 0);

        if (isPastDate || (isToday && now > taskEndTime)) {
          missed.push({
            title: task.title,
            staffName: person.name,
            time: task.timeStart,
            date: dateISO
          });
        }
      }
    }
  }
  return missed;
};
