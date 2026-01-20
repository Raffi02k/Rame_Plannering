
import React from 'react';
import { Info, MessageSquare } from 'lucide-react';
import { getUITranslations } from '../../../lib/translations';

interface SbarViewProps {
  activeLang: string;
}

export const SbarView: React.FC<SbarViewProps> = ({ activeLang }) => {
  const t = getUITranslations(activeLang);

  const sections = [
    {
      letter: 'S',
      title: t.sbarS,
      color: 'bg-blue-600',
      questions: [
        activeLang === 'sv' ? 'Vad är problemet/anledningen till kontakt?' : 'What is the problem/reason for contact?',
      ],
      actions: [
        { label: activeLang === 'sv' ? 'Ange' : 'State', content: activeLang === 'sv' ? 'Eget namn, titel, enhet, patientens namn, ålder/personnummer.' : 'Your name, title, unit, patient name, age/personal number.' },
        { label: activeLang === 'sv' ? 'Jag kontaktar dig för att ______' : 'I am contacting you because ______', content: '' }
      ]
    },
    {
      letter: 'B',
      title: t.sbarB,
      color: 'bg-indigo-600',
      questions: [
        activeLang === 'sv' ? 'Kortfattad och relevant sjukhistoria för att skapa en gemensam bild av patientens tillstånd fram tills nu.' : 'Brief and relevant medical history to create a shared image of the patient\'s condition up until now.',
      ],
      actions: [
        { label: activeLang === 'sv' ? 'Informera om' : 'Inform about', content: activeLang === 'sv' ? 'Tidigare och nuvarande sjukdomar av betydelse. Kort rapport av aktuella problem och behandlingar fram tills nu.' : 'Previous and current significant illnesses. Short report of current problems and treatments up until now.' }
      ]
    },
    {
      letter: 'A',
      title: t.sbarA,
      color: 'bg-sky-600',
      questions: [
        activeLang === 'sv' ? 'Aktuellt tillstånd och analys. Status.' : 'Current state and analysis. Status.',
        activeLang === 'sv' ? 'Bedömning.' : 'Assessment.'
      ],
      actions: [
        { label: activeLang === 'sv' ? 'Rapportera' : 'Report', content: activeLang === 'sv' ? 'Vitalparametrar enligt NEWS/Swe-PEWS.' : 'Vital signs according to NEWS/Swe-PEWS.' },
        { label: activeLang === 'sv' ? 'Jag bedömer att ______' : 'I assess that ______', content: '' }
      ]
    },
    {
      letter: 'R',
      title: t.sbarR,
      color: 'bg-slate-700',
      questions: [
        activeLang === 'sv' ? 'Rekommendation och Risker. Åtgärd.' : 'Recommendation and Risks. Action.',
        activeLang === 'sv' ? 'Risker.' : 'Risks.',
        activeLang === 'sv' ? 'Tidsram.' : 'Timeframe.',
        activeLang === 'sv' ? 'Bekräftelse.' : 'Confirmation.'
      ],
      actions: [
        { label: activeLang === 'sv' ? '... och därför föreslår jag:' : '... and therefore I suggest:', content: activeLang === 'sv' ? 'Övervakning, Utredning/behandling, Vårdplanering/hjälpbehov, Överflyttning, Uppföljning.' : 'Monitoring, Investigation/treatment, Care planning/needs, Transfer, Follow-up.' },
        { label: activeLang === 'sv' ? 'Finns några särskilda risker att beakta?' : 'Any specific risks to consider?', content: '' },
        { label: activeLang === 'sv' ? 'Hur ofta? Hur länge? När?' : 'How often? For how long? When?', content: '' },
        { label: activeLang === 'sv' ? 'Finns fler frågor? Är vi överens?' : 'Any more questions? Are we in agreement?', content: '' }
      ]
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="flex items-center gap-2 px-2">
        <MessageSquare className="text-municipal-600" size={18} />
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">{t.sbarTitle}</h2>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start gap-3 mb-4">
        <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
        <p className="text-xs font-bold text-blue-900 leading-relaxed">
          {t.sbarIntro}
        </p>
      </div>

      <div className="space-y-4">
        {sections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className={`px-4 py-3 flex items-center gap-3 text-white ${section.color}`}>
               <span className="text-2xl font-black">{section.letter}</span>
               <h3 className="font-black text-sm uppercase tracking-wider">{section.title}</h3>
            </div>
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-3">
                 {section.questions.map((q, i) => (
                   <p key={i} className="text-xs font-bold text-gray-700 leading-relaxed">{q}</p>
                 ))}
               </div>
               <div className="space-y-4 border-l border-gray-50 pl-4">
                 {section.actions.map((a, i) => (
                   <div key={i}>
                     <p className="text-[10px] font-black text-municipal-600 uppercase tracking-tight mb-1">{a.label}</p>
                     {a.content && <p className="text-xs font-medium text-gray-500">{a.content}</p>}
                   </div>
                 ))}
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
