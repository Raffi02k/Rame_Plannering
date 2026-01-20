
import React from 'react';
import { FileText, User, ArrowRight, Clock, AlertCircle } from 'lucide-react';
import { useTasks } from '../../../context/TaskContext';
import { cn, formatLocalDate } from '../../../lib/utils';

export const ReportView = () => {
  const { tasks } = useTasks();
  const todayStr = formatLocalDate(new Date());

  // Filtrera rapporter för idag från tasks
  const todaysReports = tasks
    .filter(t => t.isReportTask && t.reportData)
    .map(t => ({
      type: t.reportType,
      date: todayStr, // Antag idag eftersom vi laddar dagens tasks
      content: t.reportData?.content,
      authorName: t.reportData?.authorName,
      toName: t.reportData?.recipient,
      timestamp: t.reportData?.timestamp
    }));

  const reportConfigs = [
    { type: 'night_to_day', label: 'Från Natt till Dag', iconColor: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { type: 'day_to_evening', label: 'Från Dag till Kväll', iconColor: 'text-orange-600', bgColor: 'bg-orange-50' }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex items-center gap-2 px-2">
        <FileText className="text-municipal-600" size={18} />
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Rapportblad SÖDER</h2>
      </div>

      {reportConfigs.map((config) => {
        const report = todaysReports.find(r => r.type === config.type);

        return (
          <div key={config.type} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden group hover:shadow-lg transition-all">
            <div className={cn("px-4 py-3 border-b flex justify-between items-center", config.bgColor)}>
              <div className="flex items-center gap-2">
                <div className={cn("p-1.5 rounded-lg bg-white shadow-sm", config.iconColor)}>
                  <FileText size={16} />
                </div>
                <h3 className="font-black text-gray-900 text-sm">{config.label}</h3>
              </div>
              {report && (
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                  <div className="flex items-center gap-1">
                    <Clock size={12} />
                    {report.timestamp}
                  </div>
                  <span className="opacity-30">|</span>
                  <span className="text-gray-500 bg-white/60 px-1.5 py-0.5 rounded border border-gray-200/50">
                    {report.date.split('-')[2]}/{report.date.split('-')[1]}
                  </span>
                </div>
              )}
            </div>

            <div className="p-4 space-y-4">
              {/* Header info likt bilden */}
              <div className="grid grid-cols-2 gap-4 border-b border-gray-50 pb-3">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Namn från:</p>
                  <div className="flex items-center gap-1.5">
                    <User size={12} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-700">{report?.authorName || '—'}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">Namn till:</p>
                  <div className="flex items-center gap-1.5">
                    <ArrowRight size={12} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-700">{report?.toName || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="min-h-[80px]">
                {report ? (
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 italic text-sm text-gray-800 leading-relaxed">
                    {report.content}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 text-gray-300 gap-2">
                    <AlertCircle size={24} className="opacity-20" />
                    <p className="text-xs font-bold italic">Ingen rapport inlämnad ännu</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
