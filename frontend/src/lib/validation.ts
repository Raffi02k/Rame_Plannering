
import { Task } from '../types';
import { getShiftForDate, formatLocalDate } from './utils';
import { STAFF } from './demo-data';

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

/**
 * Checks if a time range fits within the user's shift.
 */
export function validateShiftCompatibility(
    staffId: string,
    date: Date,
    startTime: string,
    endTime: string,
    lang: string = 'sv'
): ValidationResult {
    const shift = getShiftForDate(staffId, date, lang);

    if (shift.type === 'off') {
        return { isValid: false, error: 'User is off duty on this day.' };
    }

    const [shiftStart, shiftEnd] = shift.time.split(' - ');
    if (!shiftStart || !shiftEnd) return { isValid: true };

    const parseTime = (t: string) => {
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };

    const startMin = parseTime(startTime);
    const endMin = parseTime(endTime);
    const shiftStartMin = parseTime(shiftStart);
    let shiftEndMin = parseTime(shiftEnd);

    // If shift ends strictly smaller than start, it means it crosses midnight
    if (shiftEndMin < shiftStartMin) {
        shiftEndMin += 24 * 60;
    }

    const [sStart, sEnd] = shift.time.split(' - ').map(parseTime);
    const isOvernight = sEnd < sStart;

    // Check Today's Shift
    if (!isOvernight) {
        // Day shift: simple range check
        if (startMin >= sStart && endMin <= sEnd) return { isValid: true };
    } else {
        // Night shift (e.g. 21:00 - 07:00): Valid if starts after 21:00 today
        if (startMin >= sStart) return { isValid: true };
    }

    // Check Yesterday's Shift (if it spilled over to today)
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    const prevShift = getShiftForDate(staffId, yesterday, lang);

    if (prevShift.type !== 'off') {
        const [psStart, psEnd] = prevShift.time.split(' - ').map(parseTime);
        if (psEnd < psStart) {
            // It was overnight. Valid if task ends before previous shift ends (today morning)
            if (endMin <= psEnd) return { isValid: true };
        }
    }

    return { isValid: false, error: `Outside of shift (${shift.label}: ${shift.time})` };
}

export function validateTaskOverlap(
    staffId: string,
    date: Date,
    startTime: string,
    endTime: string,
    existingTasks: Task[],
    excludeTaskId?: string,
    lang: string = 'sv'
): ValidationResult {
    const parseTime = (t: string) => {
        if (!t) return 0;
        const [h, m] = t.split(':').map(Number);
        return h * 60 + m;
    };
    const newStart = parseTime(startTime);
    const newEnd = parseTime(endTime);

    const dateKey = formatLocalDate(date);
    const shift = getShiftForDate(staffId, date, lang);

    // Filter tasks for the same staff and date (both direct assignment and via shift role)
    const relevantTasks = existingTasks.filter(t =>
        (t.assigneeId === staffId || t.shiftRole === shift.id) &&
        (t.date === dateKey || !t.date) &&
        t.id !== excludeTaskId
    );

    for (const t of relevantTasks) {
        if (!t.timeStart || !t.timeEnd) continue;
        const tStart = parseTime(t.timeStart);
        const tEnd = parseTime(t.timeEnd);

        // Check if time ranges overlap
        if (Math.max(newStart, tStart) < Math.min(newEnd, tEnd)) {
            return { isValid: false, error: `Overlaps with task: ${t.title} (${t.timeStart}-${t.timeEnd})` };
        }
    }

    return { isValid: true };
}
