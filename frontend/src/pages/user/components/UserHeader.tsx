
import React from 'react';
import { LogOut, Sun, Languages } from 'lucide-react';
import { Person } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { getUITranslations } from '../../../lib/translations';

interface UserHeaderProps {
  user: Person;
  activeLang: string;
  onLangChange: (lang: string) => void;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ user, activeLang, onLangChange }) => {
  const { logout } = useAuth();
  const t = getUITranslations(activeLang);
  const locale = activeLang === 'ar' ? 'ar-EG' : activeLang === 'en' ? 'en-US' : activeLang === 'es' ? 'es-ES' : 'sv-SE';
  const dateStr = new Date().toLocaleDateString(locale, { weekday: 'long', day: 'numeric', month: 'long' });
  const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  return (
    <header className="bg-white p-6 shadow-sm flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={logout}
          className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-400 transition-colors"
          title={t.logout}
        >
          <LogOut className="rotate-180 w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.userGreeting} {user.name.split(' ')[0]}!</h1>
          <p className="text-slate-500 font-medium">{formattedDate}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="h-9 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors flex items-center px-3 gap-1 border border-slate-200 relative">
          <Languages size={14} className="text-slate-500 pointer-events-none" />
          <select
            value={activeLang}
            onChange={(e) => onLangChange(e.target.value)}
            className="bg-transparent text-[10px] font-bold text-slate-700 uppercase focus:outline-none appearance-none cursor-pointer w-full py-1 pr-1"
          >
            <option value="sv" className="text-black">🇸🇪 SV</option>
            <option value="en" className="text-black">🇬🇧 EN</option>
            <option value="ar" className="text-black">🇦🇪 AR</option>
            <option value="es" className="text-black">🇪🇸 ES</option>
          </select>
        </div>
        <Sun size={40} className="text-yellow-500" />
      </div>
    </header>
  );
};
