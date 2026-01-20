
import React from 'react';
import { ExternalLink, Stethoscope, ShoppingCart, Globe, AppWindow } from 'lucide-react';

interface LinkItem {
  title: string;
  url: string;
  description?: string;
  icon: React.ReactNode;
}

interface LinkCategory {
  title: string;
  links: LinkItem[];
}

interface LinksViewProps {
  activeLang: string;
}

export const LinksView: React.FC<LinksViewProps> = ({ activeLang }) => {
  const t = {
    medical: activeLang === 'sv' ? 'Medicinskt' : activeLang === 'en' ? 'Medical' : activeLang === 'es' ? 'Médico' : 'طبي',
    ordering: activeLang === 'sv' ? 'Beställning' : activeLang === 'en' ? 'Ordering' : activeLang === 'es' ? 'Pedidos' : 'طلبات',
    other: activeLang === 'sv' ? 'Övrigt' : activeLang === 'en' ? 'Other' : activeLang === 'es' ? 'Otros' : 'أخرى',
    openLink: activeLang === 'sv' ? 'Öppna länk' : activeLang === 'en' ? 'Open link' : activeLang === 'es' ? 'Abrir enlace' : 'فتح الرابط'
  };

  const categories: LinkCategory[] = [
    {
      title: t.medical,
      links: [
        {
          title: 'MCSS - Signering',
          description: 'Digital läkemedelssignering och delegering.',
          url: 'https://apps.apple.com/se/app/mcss/id1079010689',
          icon: <Stethoscope size={20} className="text-red-600" />
        }
      ]
    },
    {
      title: t.ordering,
      links: [
        {
          title: 'ICA Online',
          description: 'Handla online för verksamhetens inköp.',
          url: 'https://www.ica.se/butiker/handla-online/',
          icon: <ShoppingCart size={20} className="text-orange-600" />
        },
        {
          title: 'Varuförsörjning',
          description: 'Logistik och materialbeställning.',
          url: 'https://www.vardpraktikan.se/varuf%C3%B6rs%C3%B6rjning-och-logistik/',
          icon: <AppWindow size={20} className="text-blue-600" />
        }
      ]
    },
    {
      title: t.other,
      links: [
        {
          title: 'Medvind',
          description: 'Tidrapportering och schema för Trollhättans Stad.',
          url: 'https://medvind.trollhattan.se/MvWeb/MvWeb.aspx',
          icon: <Globe size={20} className="text-municipal-600" />
        }
      ]
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      {categories.map((category, catIdx) => (
        <div key={catIdx} className="space-y-3">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2">
            {category.title}
          </h3>
          <div className="grid gap-3">
            {category.links.map((link, linkIdx) => (
              <a
                key={linkIdx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all hover:border-municipal-200 hover:shadow-md"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center group-hover:bg-white transition-colors">
                    {link.icon}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-gray-900 text-sm">{link.title}</h4>
                    {link.description && (
                      <p className="text-xs text-gray-500 truncate">{link.description}</p>
                    )}
                  </div>
                </div>
                <div className="text-gray-300 group-hover:text-municipal-500 transition-colors">
                  <ExternalLink size={18} />
                </div>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
