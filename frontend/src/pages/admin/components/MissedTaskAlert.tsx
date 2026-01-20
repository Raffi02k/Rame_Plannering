
import React from 'react';
import { AlertCircle } from 'lucide-react';

interface MissedTaskAlertProps {
  title: string;
  description: string | null;
  buttonText: string;
  onShowReport: () => void;
}

export const MissedTaskAlert: React.FC<MissedTaskAlertProps> = ({ 
  title, 
  description, 
  buttonText, 
  onShowReport 
}) => {
  if (!description) return null;

  return (
    <div className="bg-white border-l-4 border-red-500 rounded-r-lg shadow-sm p-4 mb-6 flex items-start sm:items-center justify-between gap-4 animate-fade-in">
      <div className="flex gap-4">
        <div className="bg-red-100 p-2.5 rounded-full text-red-600 shrink-0">
          <AlertCircle size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm sm:text-base">{title}</h3>
          <div className="text-gray-600 text-sm mt-0.5">
            {description}
          </div>
        </div>
      </div>
      <button 
        onClick={onShowReport}
        className="whitespace-nowrap px-4 py-2 bg-red-50 text-red-700 text-sm font-bold rounded-lg hover:bg-red-100 transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
};
