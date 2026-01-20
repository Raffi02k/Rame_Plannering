
import React from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Button } from '../../../components/Button';
import { MissedTaskInfo } from '../logic/missedTaskHelpers';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  missedTasks: MissedTaskInfo[];
  activeLang: string;
  isWeekView: boolean;
}

export const ReportModal: React.FC<ReportModalProps> = ({ 
  isOpen, 
  onClose, 
  missedTasks,
  activeLang,
  isWeekView
}) => {
  if (!isOpen) return null;

  const getDayLabel = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(activeLang === 'sv' ? 'sv-SE' : 'en-US', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const titleText = isWeekView 
    ? (activeLang === 'sv' ? 'Avvikelserapport - Veckan' : 'Deviation Report - Week')
    : (activeLang === 'sv' ? 'Avvikelserapport - Gårdagen/Idag' : 'Deviation Report - Yesterday/Today');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden animate-scale-in">
        <div className="bg-red-600 px-6 py-5 flex justify-between items-center text-white">
           <h3 className="font-bold text-lg flex items-center gap-2"><AlertCircle /> {titleText}</h3>
           <button onClick={onClose} className="hover:bg-red-700 p-1 rounded"><X /></button>
        </div>
        <div className="p-6">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
             {missedTasks.length > 0 ? (
               missedTasks.map((item, idx) => (
                 <div key={idx} className="flex items-start gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                    <div className="w-10 h-10 rounded-full bg-red-200 flex items-center justify-center text-red-700 font-bold flex-shrink-0">{idx + 1}</div>
                    <div className="flex-1">
                       <h4 className="font-bold text-red-900">
                         {item.title} <span className="text-red-700 font-normal">({item.staffName})</span>
                       </h4>
                       <p className="text-sm text-red-800 mt-1">
                         {isWeekView ? `${getDayLabel(item.date)}, ` : ''}
                         {activeLang === 'sv' ? `Skulle utförts ${item.time}. Ej signerad.` : `Scheduled for ${item.time}. Not signed.`}
                       </p>
                    </div>
                 </div>
               ))
             ) : (
               <div className="text-center py-10 text-gray-400 font-medium italic">
                 {activeLang === 'sv' ? 'Inga missade uppgifter hittades.' : 'No missed tasks found.'}
               </div>
             )}
          </div>
          <div className="mt-8 flex justify-end">
             <Button variant="outline" onClick={onClose}>{activeLang === 'sv' ? 'Stäng' : 'Close'}</Button>
          </div>
        </div>
      </div>
    </div>
  );
};
