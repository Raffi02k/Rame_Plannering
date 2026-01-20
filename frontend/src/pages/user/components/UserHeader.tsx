
import React from 'react';
import { Link } from 'react-router-dom';
import { LogOut, Sun } from 'lucide-react';
import { Person } from '../../../types';
import { useAuth } from '../../../context/AuthContext';

interface UserHeaderProps {
  user: Person;
}

export const UserHeader: React.FC<UserHeaderProps> = ({ user }) => {
  const { logout } = useAuth();

  return (
    <header className="bg-white p-6 shadow-sm flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <button
          onClick={logout}
          className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-400 transition-colors"
          title="Logga ut"
        >
          <LogOut className="rotate-180 w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Hej {user.name.split(' ')[0]}!</h1>
          <p className="text-slate-500 font-medium">Måndag 14 Oktober</p>
        </div>
      </div>
      <Sun size={40} className="text-yellow-500" />
    </header>
  );
};
