
import React from 'react';
import { Languages, Bell, ChevronLeft, ChevronRight, Calendar, RotateCcw, LogOut } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { Person } from '../../../types';
import { useAuth } from '../../../context/AuthContext';

interface StaffHeaderProps {
  user: Person;
  progress: number;
  activeTab: 'today' | 'report' | 'links' | 'contacts' | 'sbar';
  onTabChange: (tab: 'today' | 'report' | 'links' | 'contacts' | 'sbar') => void;
  activeLang: string;
  onLangChange: (lang: string) => void;
  currentDate: Date;
  onNavigateDate: (direction: 'prev' | 'next') => void;
  onNavigateToday: () => void;
  isAdmin?: boolean;
  allStaff?: Person[];
  onSelectStaff?: (id: string) => void;
}


export const StaffHeader: React.FC<StaffHeaderProps> = ({
  user,
  progress,
  activeTab,
  onTabChange,
  activeLang,
  onLangChange,
  currentDate,
  onNavigateDate,
  onNavigateToday,
  isAdmin,
  allStaff,
  onSelectStaff
}) => {
  const { logout } = useAuth();

  const isToday = new Date().toDateString() === currentDate.toDateString();
  const locale = activeLang === 'ar' ? 'ar-EG' : activeLang === 'en' ? 'en-US' : activeLang === 'es' ? 'es-ES' : 'sv-SE';
  const dateStr = currentDate.toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
  const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  const t = {
    today: activeLang === 'sv' ? 'Idag' : activeLang === 'en' ? 'Today' : activeLang === 'es' ? 'Hoy' : 'اليوم',
    dailyTasks: activeLang === 'sv' ? 'Dagens uppgifter' : activeLang === 'en' ? 'Daily Tasks' : activeLang === 'es' ? 'Tareas Diarias' : 'المهام اليومية',
    done: activeLang === 'sv' ? 'klart' : activeLang === 'en' ? 'done' : activeLang === 'es' ? 'listo' : 'تم',
    schedule: activeLang === 'sv' ? 'Schema' : activeLang === 'en' ? 'Schedule' : activeLang === 'es' ? 'Horario' : 'جدول',
    report: activeLang === 'sv' ? 'Rapportera' : activeLang === 'en' ? 'Report' : activeLang === 'es' ? 'Informe' : 'تقرير',
    links: activeLang === 'sv' ? 'Länkar' : activeLang === 'en' ? 'Links' : activeLang === 'es' ? 'Enlaces' : 'روابط',
    contacts: activeLang === 'sv' ? 'Kontakt' : activeLang === 'en' ? 'Contacts' : activeLang === 'es' ? 'Contacto' : 'اتصال',
    sbar: 'SBAR',
    viewingAs: activeLang === 'sv' ? 'Visar som' : activeLang === 'en' ? 'Viewing as' : activeLang === 'es' ? 'Viendo como' : 'عرض ك',
    logout: activeLang === 'sv' ? 'Logga ut' : activeLang === 'en' ? 'Log out' : activeLang === 'es' ? 'Cerrar sesión' : 'تسجيل الخروج'
  };

  return (
    <header className="bg-municipal-900 text-white pt-8 pb-6 px-6 rounded-b-[30px] shadow-lg sticky top-0 z-10 transition-all">
      {/* Top Row: User & Utils */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img src={user.avatar} className="w-10 h-10 rounded-full border-2 border-municipal-500 shadow-sm" alt="Avatar" />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-municipal-900 rounded-full"></div>
          </div>
          <div>
            {isAdmin && allStaff && onSelectStaff ? (
              <div className="relative">
                <select
                  className="bg-transparent text-lg font-bold leading-tight tracking-tight focus:outline-none cursor-pointer appearance-none pr-6"
                  value={user.id}
                  onChange={(e) => onSelectStaff(e.target.value)}
                >
                  {allStaff.map(s => (
                    <option key={s.id} value={s.id} className="text-black bg-white">
                      {s.name.split(' ')[0]}
                    </option>
                  ))}
                </select>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-municipal-300 text-[10px] uppercase font-bold tracking-wider mt-0.5">{t.viewingAs}: {user.role}</p>
              </div>
            ) : (
              <>
                <h1 className="text-lg font-bold leading-tight tracking-tight">{user.name.split(' ')[0]}</h1>
                <p className="text-municipal-300 text-[10px] uppercase font-bold tracking-wider">{user.role}</p>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          {/* Language Dropdown */}
          <div className="h-9 rounded-full bg-municipal-800 hover:bg-municipal-700 transition-colors flex items-center px-3 gap-1 border border-municipal-700 relative">
            <Languages size={14} className="text-municipal-400 pointer-events-none" />
            <select
              value={activeLang}
              onChange={(e) => onLangChange(e.target.value)}
              className="bg-transparent text-[10px] font-bold text-white uppercase focus:outline-none appearance-none cursor-pointer w-full py-1 pr-1"
            >
              <option value="sv" className="text-black">🇸🇪 SV</option>
              <option value="en" className="text-black">🇬🇧 EN</option>
              <option value="ar" className="text-black">🇦🇪 AR</option>
              <option value="es" className="text-black">🇪🇸 ES</option>
            </select>
          </div>

          <button
            onClick={logout}
            className="p-2 rounded-full bg-municipal-800 hover:bg-red-500/20 hover:text-red-400 transition-all relative w-9 h-9 flex items-center justify-center border border-municipal-700"
            title={t.logout}
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Date Navigation */}
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-center justify-between bg-municipal-800/60 rounded-2xl p-1 border border-white/10 backdrop-blur-md shadow-inner relative h-[58px]">
          <button
            onClick={() => onNavigateDate('prev')}
            className="p-3 hover:bg-white/10 rounded-xl text-municipal-200 hover:text-white transition-all active:scale-90"
          >
            <ChevronLeft size={22} className={activeLang === 'ar' ? 'rotate-180' : ''} />
          </button>

          <div className="flex flex-col items-center justify-center flex-1 h-full">
            <div className="flex items-center gap-1.5">
              <Calendar size={13} className="text-municipal-400" />
              <span className="text-sm font-bold text-white tracking-tight">
                {formattedDate}
              </span>
            </div>

            <div className="h-5 flex items-center mt-0.5">
              {isToday ? (
                <span className="text-[9px] font-black text-municipal-400 uppercase tracking-widest">{t.today}</span>
              ) : (
                <button
                  onClick={onNavigateToday}
                  className="bg-municipal-500/30 hover:bg-municipal-500/50 text-white text-[9px] font-black px-2.5 py-0.5 rounded-full border border-white/10 flex items-center gap-1 transition-all animate-in fade-in zoom-in-95"
                >
                  <RotateCcw size={8} />
                  {t.today}
                </button>
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigateDate('next')}
            className="p-3 hover:bg-white/10 rounded-xl text-municipal-200 hover:text-white transition-all active:scale-90"
          >
            <ChevronRight size={22} className={activeLang === 'ar' ? 'rotate-180' : ''} />
          </button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="bg-municipal-800/40 rounded-2xl p-5 backdrop-blur-sm border border-white/10 shadow-lg">
        <div className="flex justify-between items-center text-xs mb-3.5 px-0.5">
          <span className="text-white/80 font-bold uppercase tracking-widest text-[10px]">{t.dailyTasks}</span>
          <span className="font-black text-white bg-white/10 px-3 py-1 rounded-full border border-white/10 text-[11px] shadow-sm">
            {progress}% <span className="font-medium text-white/60 ml-0.5">{t.done}</span>
          </span>
        </div>
        <div className="h-3.5 bg-black/40 rounded-full overflow-hidden p-[2px] border border-white/5 shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-green-500 via-green-400 to-green-500 rounded-full transition-all duration-1000 ease-out relative shadow-[0_0_12px_rgba(74,222,128,0.4)]"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-white/20 h-[50%] opacity-30"></div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-4 mt-6 border-b border-white/5 pb-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => onTabChange('today')}
          className={cn("text-sm font-bold pb-2 relative transition-all shrink-0", activeTab === 'today' ? "text-white" : "text-municipal-400 hover:text-municipal-200")}
        >
          {t.schedule}
          {activeTab === 'today' && <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-white rounded-t-full shadow-[0_-2px_6px_rgba(255,255,255,0.4)]"></div>}
        </button>
        <button
          onClick={() => onTabChange('report')}
          className={cn("text-sm font-bold pb-2 relative transition-all shrink-0", activeTab === 'report' ? "text-white" : "text-municipal-400 hover:text-municipal-200")}
        >
          {t.report}
          {activeTab === 'report' && <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-white rounded-t-full shadow-[0_-2px_6px_rgba(255,255,255,0.4)]"></div>}
        </button>
        <button
          onClick={() => onTabChange('links')}
          className={cn("text-sm font-bold pb-2 relative transition-all shrink-0", activeTab === 'links' ? "text-white" : "text-municipal-400 hover:text-municipal-200")}
        >
          {t.links}
          {activeTab === 'links' && <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-white rounded-t-full shadow-[0_-2px_6px_rgba(255,255,255,0.4)]"></div>}
        </button>
        <button
          onClick={() => onTabChange('contacts')}
          className={cn("text-sm font-bold pb-2 relative transition-all shrink-0", activeTab === 'contacts' ? "text-white" : "text-municipal-400 hover:text-municipal-200")}
        >
          {t.contacts}
          {activeTab === 'contacts' && <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-white rounded-t-full shadow-[0_-2px_6px_rgba(255,255,255,0.4)]"></div>}
        </button>
        <button
          onClick={() => onTabChange('sbar')}
          className={cn("text-sm font-bold pb-2 relative transition-all shrink-0 uppercase tracking-tighter", activeTab === 'sbar' ? "text-white" : "text-municipal-400 hover:text-municipal-200")}
        >
          {t.sbar}
          {activeTab === 'sbar' && <div className="absolute bottom-[-5px] left-0 w-full h-1 bg-white rounded-t-full shadow-[0_-2px_6px_rgba(255,255,255,0.4)]"></div>}
        </button>
      </div>
    </header>
  );
};
