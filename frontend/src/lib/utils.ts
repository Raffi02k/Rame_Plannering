
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ShiftRole, Person } from "../types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Returns YYYY-MM-DD in local time
 */
export function formatLocalDate(date: Date): string {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().split('T')[0];
}

export function getCategoryColor(category: string): string {
    switch (category?.toLowerCase()) {
        case 'hsl': return 'bg-red-100 text-red-800 border-red-200';
        case 'care': return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'service': return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'social': return 'bg-green-100 text-green-800 border-green-200';
        case 'admin': return 'bg-gray-100 text-gray-800 border-gray-200';
        default: return 'bg-gray-100 text-gray-800';
    }
}

export function getTeamColorClasses(color?: string) {
    switch (color) {
        case 'red': return 'bg-team-red border-team-redBorder';
        case 'blue': return 'bg-team-blue border-team-blueBorder';
        case 'purple': return 'bg-team-purple border-team-purpleBorder';
        case 'white': return 'bg-team-white border-team-whiteBorder';
        default: return 'bg-white border-gray-200';
    }
}

export function getWeekNumber(d: Date): number {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7));
    const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
    const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
    return weekNo;
}

interface ShiftInfo {
    id: ShiftRole;
    type: 'day' | 'eve' | 'night' | 'off';
    label: string;
    color: string;
    time: string;
}

/**
 * Calculates the exact shift ROLE for a person on a specific date.
 * ENSURES NO DUPLICATES WITHIN THE SAME UNIT ON THE SAME DAY.
 */
export function getShiftForDate(
    personId: string,
    date: Date,
    lang: string = 'sv',
    staffList: Person[] = []
): ShiftInfo {
    const isStaffRole = (role?: string) => role === 'staff' || role === 'personal';
    const person = staffList.find(s => s.id === personId);
    const unitId = person?.unitId || 'u1';
    const dateStr = formatLocalDate(date);

    // 1. Get all staff that belong to this unit, and sort them for a stable order
    const unitStaff = staffList
        .filter(staffMember =>
            staffMember.unitId === unitId &&
            isStaffRole(staffMember.role)
        )
        .sort((first, second) =>
            first.id.localeCompare(second.id)
        );

    const personIndex = unitStaff.findIndex(
        staffMember => staffMember.id === personId
    );

    // 2. Define all available active shift roles
    const activeRoles: ShiftRole[] = unitId === 'u3'
        ? ['dev_alpha', 'dev_beta', 'dev_gamma', 'dev_delta']
        : [
            'morning_red', 'morning_blue',
            'evening_red', 'evening_blue',
            'night_red', 'night_blue'
        ];

    // 3. Create a pool of shifts: Active roles + enough "off" to cover everyone
    let shiftPool: ShiftRole[] = [...activeRoles];
    while (shiftPool.length < unitStaff.length) {
        shiftPool.push('off');
    }

    // 4. Deterministisk shuffle baserat på datum och enhet
    const seed = (dateStr + unitId).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seededRandom = (s: number) => {
        const x = Math.sin(s) * 10000;
        return x - Math.floor(x);
    };

    // Shuffle algorithm (Fisher-Yates) using our seed
    for (let i = shiftPool.length - 1; i > 0; i--) {
        const j = Math.floor(seededRandom(seed + i) * (i + 1));
        [shiftPool[i], shiftPool[j]] = [shiftPool[j], shiftPool[i]];
    }

    // 5. Get this person's assigned role from the shuffled pool
    const assignedRoleId = personIndex !== -1 ? shiftPool[personIndex] : 'off';

    // 6. Return the full ShiftInfo object with translations
    const t = (sv: string, en: string, ar: string, es: string) => {
        if (lang === 'en') return en;
        if (lang === 'ar') return ar;
        if (lang === 'es') return es;
        return sv;
    };

    const shiftMap: Record<ShiftRole, ShiftInfo> = {
        'off': {
            id: 'off', type: 'off', label: t('Ledig', 'Off', 'عطلة', 'Libre'),
            color: 'bg-gray-50 text-gray-400', time: ''
        },
        'morning_red': {
            id: 'morning_red', type: 'day', label: t('Dag (Röd)', 'Day (Red)', 'نهار (أحمر)', 'Día (Rojo)'),
            color: 'bg-rose-100 text-rose-900 border-rose-300', time: '07:00 - 16:00'
        },
        'morning_blue': {
            id: 'morning_blue', type: 'day', label: t('Dag (Blå)', 'Day (Blue)', 'نهار (أزرق)', 'Día (Azul)'),
            color: 'bg-sky-100 text-sky-900 border-sky-300', time: '07:00 - 16:00'
        },
        'evening_red': {
            id: 'evening_red', type: 'eve', label: t('Kväll (Röd)', 'Evening (Red)', 'مساء (أحمر)', 'Tarde (Rojo)'),
            color: 'bg-red-100 text-red-900 border-red-300', time: '13:30 - 21:00'
        },
        'evening_blue': {
            id: 'evening_blue', type: 'eve', label: t('Kväll (Blå)', 'Evening (Blue)', 'مساء (أزرق)', 'Tarde (Azul)'),
            color: 'bg-blue-100 text-blue-900 border-blue-300', time: '13:00 - 21:00'
        },
        'night_red': {
            id: 'night_red', type: 'night', label: t('Natt (Röd)', 'Night (Red)', 'ليل (أحمر)', 'Noche (Rojo)'),
            color: 'bg-slate-800 text-red-200 border-red-900', time: '21:00 - 07:00'
        },
        'night_blue': {
            id: 'night_blue', type: 'night', label: t('Natt (Blå)', 'Night (Blue)', 'ليل (أزرق)', 'Noche (Azul)'),
            color: 'bg-slate-800 text-blue-200 border-blue-900', time: '21:00 - 07:00'
        },
        'admin_day': {
            id: 'admin_day', type: 'day', label: 'Admin', color: 'bg-gray-800 text-white', time: '08:00 - 17:00'
        },
        'dev_alpha': {
            id: 'dev_alpha', type: 'day', label: t('Utveckling A', 'Development A', 'تطوير أ', 'Desarrollo A'),
            color: 'bg-emerald-100 text-emerald-900 border-emerald-300', time: '08:00 - 17:00'
        },
        'dev_beta': {
            id: 'dev_beta', type: 'day', label: t('Utveckling B', 'Development B', 'تطوير ب', 'Desarrollo B'),
            color: 'bg-teal-100 text-teal-900 border-teal-300', time: '08:00 - 17:00'
        },
        'dev_gamma': {
            id: 'dev_gamma', type: 'day', label: t('Utveckling C', 'Development C', 'تطوير ج', 'Desarrollo C'),
            color: 'bg-amber-100 text-amber-900 border-amber-300', time: '08:00 - 17:00'
        },
        'dev_delta': {
            id: 'dev_delta', type: 'day', label: t('Utveckling D', 'Development D', 'تطوير د', 'Desarrollo D'),
            color: 'bg-violet-100 text-violet-900 border-violet-300', time: '08:00 - 17:00'
        }
    };

    return shiftMap[assignedRoleId] || shiftMap['off'];
}
