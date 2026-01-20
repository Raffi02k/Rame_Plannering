
import React from 'react';
import { Phone, User, Shield, Stethoscope, Briefcase, Clock } from 'lucide-react';
import { getUITranslations } from '../../../lib/translations';

interface ContactItem {
  title: string;
  name?: string;
  phone: string;
  icon: React.ReactNode;
  color: string;
}

interface ContactsViewProps {
  activeLang: string;
}

export const ContactsView: React.FC<ContactsViewProps> = ({ activeLang }) => {
  const t = getUITranslations(activeLang);

  const contacts: ContactItem[] = [
    {
      title: t.manager,
      name: 'Linda Holmgren',
      phone: '0520-49 50 01',
      icon: <Briefcase size={20} />,
      color: 'text-municipal-600 bg-municipal-50'
    },
    {
      title: t.coordinator,
      name: 'Mikael Björk',
      phone: '0520-49 50 05',
      icon: <User size={20} />,
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: t.nurse,
      name: 'Maria Carlsson',
      phone: '0520-49 50 10',
      icon: <Stethoscope size={20} />,
      color: 'text-red-600 bg-red-50'
    },
    {
      title: t.nurseOnCall,
      phone: '0520-49 99 99',
      icon: <Clock size={20} />,
      color: 'text-red-700 bg-red-100'
    },
    {
      title: t.security,
      phone: '0520-48 00 00',
      icon: <Shield size={20} />,
      color: 'text-slate-700 bg-slate-100'
    }
  ];

  return (
    <div className="space-y-4 animate-fade-in pb-10">
      <div className="flex items-center gap-2 px-2 mb-2">
        <Phone className="text-municipal-600" size={18} />
        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">{t.contacts}</h2>
      </div>

      <div className="grid gap-3">
        {contacts.map((contact, index) => (
          <div 
            key={index}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-municipal-200 transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${contact.color}`}>
                {contact.icon}
              </div>
              <div className="min-w-0">
                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">{contact.title}</h4>
                <div className="flex flex-col">
                  {contact.name && <span className="font-bold text-gray-900 text-sm">{contact.name}</span>}
                  <span className="font-mono text-municipal-700 font-bold text-base tracking-tighter">{contact.phone}</span>
                </div>
              </div>
            </div>
            
            <a 
              href={`tel:${contact.phone.replace(/\s/g, '')}`}
              className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-green-200 active:scale-90 transition-transform"
            >
              <Phone size={20} fill="currentColor" />
            </a>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-orange-50 rounded-2xl border border-orange-100 flex items-start gap-3">
         <div className="p-2 bg-white rounded-lg text-orange-600 shadow-sm shrink-0">
           <Phone size={18} />
         </div>
         <p className="text-xs font-bold text-orange-900 leading-relaxed">
           Vid akuta nödsituationer som kräver polis, ambulans eller brandkår, ring alltid <span className="text-base font-black">112</span>.
         </p>
      </div>
    </div>
  );
};
