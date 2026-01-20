
import React from 'react';
import { Filter, Sun, Sunrise, Moon, X } from 'lucide-react';
import { cn, getCategoryColor } from '../../../lib/utils';
import { TaskCategory, Person } from '../../../types';
import { getUITranslations, getCategoryLabel } from '../../../lib/translations';

interface FilterBarProps {
  activeLang: string;
  activeFilters: TaskCategory[];
  toggleFilter: (cat: TaskCategory) => void;
  activeShiftFilters: string[];
  toggleShiftFilter: (shift: string) => void;
  allUnitStaff: Person[];
  activeStaffFilters: string[];
  toggleStaffFilter: (staffId: string) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  activeLang,
  activeFilters,
  toggleFilter,
  activeShiftFilters,
  toggleShiftFilter,
  allUnitStaff,
  activeStaffFilters,
  toggleStaffFilter,
  clearAllFilters,
  hasActiveFilters
}) => {
  const t = getUITranslations(activeLang);

  return (
    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1.5 shadow-sm overflow-x-auto no-scrollbar max-w-full">
      <span className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center">
        <Filter size={10} className={activeLang === 'ar' ? "ml-1" : "mr-1"}/> {t.filterLabel}
      </span>
      
      <div className="flex gap-1 mr-1.5">
         <button onClick={() => toggleShiftFilter('day')} title={t.dayTime} className={cn("w-7 h-7 rounded flex items-center justify-center transition-all", activeShiftFilters.includes('day') ? "bg-orange-500 text-white shadow-md" : "text-gray-400 hover:text-gray-600")}><Sun size={14}/></button>
         <button onClick={() => toggleShiftFilter('evening')} title={t.eveningTime} className={cn("w-7 h-7 rounded flex items-center justify-center transition-all", activeShiftFilters.includes('evening') ? "bg-municipal-600 text-white shadow-md" : "text-gray-400 hover:text-gray-600")}><Sunrise size={14}/></button>
         <button onClick={() => toggleShiftFilter('night')} title={t.nightTime} className={cn("w-7 h-7 rounded flex items-center justify-center transition-all", activeShiftFilters.includes('night') ? "bg-slate-800 text-white shadow-md" : "text-gray-400 hover:text-gray-600")}><Moon size={14}/></button>
      </div>

      <div className="w-px h-5 bg-gray-200 mx-1"></div>

      {Object.values(TaskCategory).map(cat => (
        <button key={cat} onClick={() => toggleFilter(cat)} className={cn("px-2.5 py-1 text-[10px] rounded-md font-bold transition-all capitalize border", activeFilters.includes(cat) ? getCategoryColor(cat) + " shadow-sm border-transparent" : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50")}>
          {getCategoryLabel(cat, activeLang)}
        </button>
      ))}

      <div className="w-px h-5 bg-gray-200 mx-1"></div>

      <div className="flex -space-x-1.5 hover:space-x-1 transition-all px-1">
        {allUnitStaff.map(person => {
          const isActive = activeStaffFilters.includes(person.id);
          const isDimmed = activeStaffFilters.length > 0 && !isActive;
          return (
            <button key={person.id} onClick={() => toggleStaffFilter(person.id)} className={cn("relative rounded-full transition-all duration-200 shrink-0", isActive ? "z-10 ring-2 ring-municipal-500 scale-110" : "hover:scale-110 hover:z-10", isDimmed && "opacity-40 grayscale")}>
              <img src={person.avatar} className="w-7 h-7 rounded-full border border-white shadow-sm" alt={person.name} />
            </button>
          );
        })}
      </div>

      {hasActiveFilters && (
        <>
          <div className="h-4 w-px bg-gray-200 mx-1"></div>
          <button onClick={clearAllFilters} className="px-2 py-1 text-[10px] text-gray-500 font-black hover:text-red-600 flex items-center gap-1 uppercase tracking-tighter transition-colors">
            <X size={10}/> {t.clearFilters}
          </button>
        </>
      )}
    </div>
  );
};
