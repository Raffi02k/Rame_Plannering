
import React from 'react';
import { CheckCircle2, AlertTriangle, Info, ShieldCheck, Key, Clock, FileText } from 'lucide-react';
import { cn, getCategoryColor } from '../../../lib/utils';
import { Task, TaskStatus } from '../../../types';
import { Badge } from '../../../components/Badge';
import { getUITranslations } from '../../../lib/translations';

interface TimelineViewProps {
  tasks: Task[];
  showVikarieMode: boolean;
  activeLang: string;
  onTaskClick: (task: Task) => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ 
  tasks, 
  showVikarieMode, 
  activeLang, 
  onTaskClick 
}) => {
  const t = getUITranslations(activeLang);

  return (
    <>
      {/* Context Notice for Vikarie */}
      {showVikarieMode && (
        <div className="bg-blue-600 border border-blue-500 p-4 rounded-2xl mb-6 animate-fade-in shadow-xl shadow-blue-100 flex items-center gap-4">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
             <Info className="text-white" size={24} />
          </div>
          <p className="text-sm text-white font-bold leading-tight">
            {t.subModeNotice}
          </p>
        </div>
      )}

      {tasks.map((task, index) => {
         const isDone = task.status === TaskStatus.COMPLETED || task.status === TaskStatus.SIGNED;
         const isMissed = task.status === TaskStatus.MISSED;
         const hasSubInfo = !!task.substituteInstructions;
         
         const categoryClasses = getCategoryColor(task.category);
         const isSignPending = !isDone && task.requiresSign;
         
         const cardStyles = cn(
           "rounded-2xl p-4 shadow-sm border-2 transition-all duration-300 cursor-pointer relative overflow-hidden",
           "active:scale-[0.97] hover:shadow-lg",
           !isDone && !isMissed && (
             isSignPending && task.category !== 'hsl' 
               ? "bg-yellow-50 border-yellow-300 text-yellow-900 shadow-yellow-100" 
               : categoryClasses.replace('text-', 'text-opacity-90 text-')
           ),
           isDone && "bg-white border-green-200 opacity-60 grayscale-[0.3] hover:grayscale-0 hover:opacity-100",
           isMissed && "border-red-400 bg-red-50 text-red-900 shadow-red-100 animate-pulse-subtle"
         );

         return (
           <div key={task.id} className="relative pl-7 pb-4 last:pb-0">
             {/* Vertical Line */}
             {index !== tasks.length - 1 && (
               <div className="absolute left-[11px] top-8 bottom-0 w-0.5 bg-gray-200/60"></div>
             )}
             
             {/* Timeline Dot */}
             <div className={cn(
               "absolute left-0 top-3 w-6 h-6 rounded-full border-2 flex items-center justify-center z-10 bg-white shadow-sm transition-all duration-300",
               isDone ? "border-green-500 text-green-500 scale-110" : 
               isMissed ? "border-red-500 bg-red-50 text-red-500" : 
               isSignPending ? "border-yellow-500 text-yellow-600" : "border-gray-300 text-gray-300"
             )}>
               {isDone ? <CheckCircle2 size={16} fill="currentColor" className="text-white" /> : 
                isMissed ? <AlertTriangle size={12} /> :
                isSignPending ? <FileText size={12} /> :
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
               }
             </div>

             {/* Card */}
             <div 
               onClick={() => onTaskClick(task)}
               className={cardStyles}
             >
               <div className="flex justify-between items-start mb-2">
                 <div className="flex items-center gap-1.5 font-black text-[10px] tracking-tight opacity-80">
                   <Clock size={12} />
                   <span>{task.timeStart} - {task.timeEnd}</span>
                 </div>
                 
                 <div className="flex gap-2">
                   {showVikarieMode && hasSubInfo && (
                     <div className="w-6 h-6 bg-white/50 backdrop-blur-sm rounded-lg flex items-center justify-center animate-bounce-subtle border border-black/5">
                        <Key size={12} />
                     </div>
                   )}
                   {task.requiresSign && (
                     <Badge variant={isDone ? 'success' : 'warning'} className="font-black px-3 py-1 uppercase tracking-wider shadow-sm border-white/20">
                       {t.sign}
                     </Badge>
                   )}
                 </div>
               </div>
               
               <h3 className={cn("text-base font-black leading-tight tracking-tight mb-1", isDone ? "line-through opacity-60" : "text-current")}>
                 {task.title}
               </h3>
               
               <p className={cn("text-xs font-bold leading-relaxed mb-3 opacity-70", isDone && "opacity-40")}>
                 {task.description}
               </p>

               {/* VIKARIE-BLOCK - Gjort mer 'blå' med bg-blue-100/50 och border-blue-200 */}
               {showVikarieMode && task.substituteInstructions && !isDone && (
                 <div className="mt-3 bg-blue-100/50 rounded-xl p-3 flex items-start gap-3 animate-in slide-in-from-top-2 duration-500 border border-blue-200 shadow-[inset_0_1px_3px_rgba(59,130,246,0.1)]">
                    <ShieldCheck size={18} className="text-blue-700 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <p className="text-[9px] font-black text-blue-700 uppercase tracking-widest mb-1">{t.subTitle}</p>
                      <p className="text-xs leading-relaxed font-black text-gray-900">
                        {task.substituteInstructions}
                      </p>
                    </div>
                 </div>
               )}
             </div>
           </div>
         )
      })}
      
      <style>{`
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes pulse-subtle {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.95; transform: scale(0.995); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 2s infinite ease-in-out;
        }
        .animate-pulse-subtle {
          animation: pulse-subtle 3s infinite ease-in-out;
        }
      `}</style>
    </>
  );
};
