
import { useMemo, CSSProperties } from 'react';
import { Task } from '../../../../../types';

interface UseScheduleLayoutProps {
  viewPeriod: 'day' | 'night';
  containerWidth: number;
  isRTL: boolean;
  STAFF_WIDTH: number;
  MIN_HOUR_WIDTH: number;
}

export const useScheduleLayout = ({
  viewPeriod,
  containerWidth,
  isRTL,
  STAFF_WIDTH,
  MIN_HOUR_WIDTH,
}: UseScheduleLayoutProps) => {
  const startHour = viewPeriod === 'day' ? 7 : 22;
  const endHour = viewPeriod === 'day' ? 22 : 31;
  const totalHours = endHour - startHour;

  const hours = Array.from({ length: totalHours }, (_, i) => {
    const h = startHour + i;
    return h >= 24 ? h - 24 : h;
  });

  const hourWidth = useMemo(() => {
    const available = Math.max(0, containerWidth - STAFF_WIDTH);
    const minNeeded = MIN_HOUR_WIDTH * totalHours;
    if (available > minNeeded) return available / totalHours;
    return MIN_HOUR_WIDTH;
  }, [containerWidth, totalHours, STAFF_WIDTH, MIN_HOUR_WIDTH]);

  const timelineWidth = totalHours * hourWidth;
  const gridTemplateColumns = `${STAFF_WIDTH}px repeat(${totalHours}, ${hourWidth}px)`;

  const getNormalizedHour = (h: number) => {
    if (viewPeriod === 'night' && h <= 6) return h + 24;
    return h;
  };

  const getTaskStyle = (task: Task) => {
    const [sH_raw, sM_raw] = task.timeStart.split(':').map(Number);
    const [eH_raw, eM_raw] = task.timeEnd.split(':').map(Number);

    let sH = getNormalizedHour(sH_raw);
    let eH = getNormalizedHour(eH_raw);
    if (eH < sH) eH += 24;

    const clampedStart = Math.max(sH + sM_raw / 60, startHour);
    const clampedEnd = Math.min(eH + eM_raw / 60, endHour);

    if (clampedStart >= endHour || clampedEnd <= startHour) return { display: 'none' as const };

    const startMinutesTotal = (clampedStart - startHour) * 60;
    const endMinutesTotal = (clampedEnd - startHour) * 60;
    const durationMinutes = endMinutesTotal - startMinutesTotal;

    const pos = (startMinutesTotal / 60) * hourWidth;
    const width = (durationMinutes / 60) * hourWidth;

    const style: CSSProperties = {
      width: `${Math.max(width - 4, 24)}px`,
      position: 'absolute',
      top: '12px',
      bottom: '12px',
      zIndex: 10,
    };

    if (isRTL) style.right = `${pos + 2}px`;
    else style.left = `${pos + 2}px`;

    return style;
  };

  const getShiftBarStyle = (shiftTime: string) => {
    if (!shiftTime) return {};
    const [startStr, endStr] = shiftTime.split(' - ');
    const [sH_raw, sM_raw] = startStr.split(':').map(Number);
    const [eH_raw, eM_raw] = endStr.split(':').map(Number);

    let sH = getNormalizedHour(sH_raw);
    let eH = getNormalizedHour(eH_raw);
    if (eH < sH) eH += 24;

    const viewEndMinutes = totalHours * 60;
    let leftMinutes = (sH - startHour) * 60 + sM_raw;
    let widthMinutes = (eH - startHour) * 60 + eM_raw - leftMinutes;

    if (leftMinutes < 0) { widthMinutes += leftMinutes; leftMinutes = 0; }
    if (leftMinutes + widthMinutes > viewEndMinutes) widthMinutes = viewEndMinutes - leftMinutes;
    if (widthMinutes <= 0) return { display: 'none' as const };

    const pos = (leftMinutes / 60) * hourWidth;
    const widthPx = (widthMinutes / 60) * hourWidth;

    if (isRTL) return { right: `${pos}px`, width: `${widthPx}px` };
    return { left: `${pos}px`, width: `${widthPx}px` };
  };

  const getDurationMinutes = (task: Task) => {
    const [sH_raw, sM_raw] = task.timeStart.split(':').map(Number);
    const [eH_raw, eM_raw] = task.timeEnd.split(':').map(Number);
    let sH = sH_raw;
    let eH = eH_raw;
    if (eH < sH) eH += 24;
    return eH * 60 + eM_raw - (sH * 60 + sM_raw);
  };

  return {
    startHour,
    endHour,
    totalHours,
    hours,
    hourWidth,
    timelineWidth,
    gridTemplateColumns,
    getNormalizedHour,
    getTaskStyle,
    getShiftBarStyle,
    getDurationMinutes,
  };
};
