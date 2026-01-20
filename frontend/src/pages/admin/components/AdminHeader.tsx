
import React from 'react';
import { Link } from 'react-router-dom';
import { Settings, MapPin, ChevronLeft, ChevronRight, Calendar, Languages, RotateCcw } from 'lucide-react';
import { cn, getWeekNumber } from '../../../lib/utils';
import { Unit } from '../../../types';
import { Button } from '../../../components/Button';
import { useAuth } from '../../../context/AuthContext';
import { LogOut } from 'lucide-react';

interface AdminHeaderProps {
  units: Unit[];
  currentUnitId: string;
  onUnitChange: (id: string) => void;
  viewMode: 'day' | 'week';
  onViewModeChange: (mode: 'day' | 'week') => void;
  activeLang: string;
  onLangChange: (lang: string) => void;
  currentDate: Date;
  onNavigate: (direction: 'prev' | 'next' | 'today') => void;
}


export const AdminHeader: React.FC<AdminHeaderProps> = ({
  units,
  currentUnitId,
  onUnitChange,
  viewMode,
  onViewModeChange,
  activeLang,
  onLangChange,
  currentDate,
  onNavigate
}) => {
  const { logout } = useAuth();

  const isRTL = activeLang === 'ar';
  const isToday = new Date().toDateString() === currentDate.toDateString();

  // Format Date for Header
  const getHeaderDateString = () => {
    if (viewMode === 'week') {
      const weekNo = getWeekNumber(currentDate);
      if (activeLang === 'en') return `Week ${weekNo}, ${currentDate.getFullYear()}`;
      if (activeLang === 'es') return `Semana ${weekNo}, ${currentDate.getFullYear()}`;
      if (activeLang === 'ar') return `الأسبوع ${weekNo}, ${currentDate.getFullYear()}`;
      return `Vecka ${weekNo}, ${currentDate.getFullYear()}`;
    } else {
      // Capitalize first letter of day
      const locale = activeLang === 'ar' ? 'ar-EG' : activeLang === 'en' ? 'en-US' : activeLang === 'es' ? 'es-ES' : 'sv-SE';
      const dateStr = currentDate.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
      return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    }
  };

  const t = {
    today: activeLang === 'sv' ? 'Idag' : activeLang === 'en' ? 'Today' : activeLang === 'es' ? 'Hoy' : 'اليوم'
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-[9999] shadow-sm">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

        {/* Left: Logo & Unit */}
        <div className="flex items-center gap-6">
          <button
            onClick={logout}
            className="text-xl font-bold text-municipal-900 flex items-center gap-2 hover:opacity-80 transition-opacity outline-none"
            title="Logga ut"
          >
            <div className="w-8 h-8 bg-municipal-900 rounded-lg flex items-center justify-center text-white shadow-lg shadow-municipal-900/20">
              <LogOut size={16} />
            </div>
            <span className="hidden lg:inline">Rame</span>
          </button>

          <div className="h-8 w-px bg-gray-200 hidden md:block"></div>

          <div className="relative group min-w-[200px] hidden md:block">
            <div className="absolute left-3 top-2.5 text-municipal-600"><MapPin size={16} /></div>
            <select
              value={currentUnitId}
              onChange={(e) => onUnitChange(e.target.value)}
              className="w-full appearance-none bg-municipal-50 pl-10 pr-10 py-2 rounded-lg text-sm font-bold text-municipal-900 border-none focus:ring-2 focus:ring-municipal-500 cursor-pointer hover:bg-municipal-100 transition-colors"
            >
              {units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
            </select>
          </div>
        </div>

        {/* Center: Date Navigation - NOW INTEGRATED WITH 'IDAG' BUTTON */}
        <div className="flex items-center gap-2 bg-gray-50/80 p-1 rounded-xl border border-gray-200 absolute left-1/2 transform -translate-x-1/2 hidden xl:flex shadow-inner">
          <button
            onClick={() => onNavigate('prev')}
            className="p-2 hover:bg-white rounded-lg text-gray-500 hover:text-municipal-600 hover:shadow-sm transition-all active:scale-95"
          >
            <ChevronLeft size={20} className={isRTL ? 'rotate-180' : ''} />
          </button>

          <div className="flex items-center gap-3 px-4 min-w-[220px] justify-center select-none">
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 font-bold text-gray-800 capitalize">
                <Calendar size={14} className="text-municipal-500" />
                {getHeaderDateString()}
              </div>
              {isToday && <span className="text-[9px] font-black text-municipal-400 uppercase tracking-widest leading-none mt-0.5">{t.today}</span>}
            </div>

            {!isToday && (
              <button
                onClick={() => onNavigate('today')}
                className="bg-municipal-100 hover:bg-municipal-200 text-municipal-700 text-[10px] font-bold px-2 py-1 rounded-md border border-municipal-200 transition-all active:scale-95 flex items-center gap-1 animate-in fade-in zoom-in-95 duration-200"
              >
                <RotateCcw size={10} />
                {t.today}
              </button>
            )}
          </div>

          <button
            onClick={() => onNavigate('next')}
            className="p-2 hover:bg-white rounded-lg text-municipal-600 hover:shadow-sm transition-all active:scale-95"
          >
            <ChevronRight size={20} className={isRTL ? 'rotate-180' : ''} />
          </button>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-3">

          {/* Language Selector */}
          <div className="hidden sm:flex items-center bg-gray-100 rounded-lg p-1 border border-gray-200">
            <Languages size={16} className="text-gray-500 ml-2 mr-1" />
            <select
              value={activeLang}
              onChange={(e) => onLangChange(e.target.value)}
              className="bg-transparent text-xs font-bold text-gray-700 py-1 pr-2 focus:outline-none cursor-pointer uppercase"
            >
              <option value="sv">🇸🇪 SV</option>
              <option value="en">🇬🇧 EN</option>
              <option value="ar">🇦🇪 AR</option>
              <option value="es">🇪🇸 ES</option>
            </select>
          </div>

          {/* View Switch */}
          <div className="flex bg-gray-100 p-1 rounded-lg border border-gray-200">
            <button
              onClick={() => onViewModeChange('day')}
              className={cn("px-4 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md transition-all", viewMode === 'day' ? "bg-municipal-600 text-white shadow-md" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50")}
            >
              {activeLang === 'sv' ? 'Dag' : activeLang === 'en' ? 'Day' : activeLang === 'es' ? 'Día' : 'يوم'}
            </button>
            <button
              onClick={() => onViewModeChange('week')}
              className={cn("px-4 py-1.5 text-xs font-bold uppercase tracking-wide rounded-md transition-all", viewMode === 'week' ? "bg-municipal-600 text-white shadow-md" : "text-gray-500 hover:text-gray-700 hover:bg-gray-200/50")}
            >
              {activeLang === 'sv' ? 'Vecka' : activeLang === 'en' ? 'Week' : activeLang === 'es' ? 'Semana' : 'أسبوع'}
            </button>
          </div>

          <div className="h-6 w-px bg-gray-300 hidden sm:block mx-1" />

          {/* User Profile */}
          <div className="flex items-center gap-3">
            <Link
              to="/staff"
              state={{ unitId: currentUnitId }}
              className="text-xs font-medium text-gray-500 hover:text-municipal-600 transition-colors hidden sm:block"
            >
              Staff View
            </Link>
            <Link to="/user" className="text-xs font-medium text-gray-500 hover:text-municipal-600 transition-colors hidden sm:block">
              User View
            </Link>
            <div className="h-9 w-9 rounded-full bg-municipal-900 text-white flex items-center justify-center font-bold text-sm shadow-md ring-2 ring-white cursor-pointer hover:bg-municipal-800 transition-colors">
              AD
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
