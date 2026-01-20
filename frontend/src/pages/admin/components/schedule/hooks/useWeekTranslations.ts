
export const useWeekTranslations = (activeLang: string) => {
  const dayNames = activeLang === 'ar' 
     ? ["الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت", "الأحد"]
     : activeLang === 'en'
     ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
     : activeLang === 'es'
     ? ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
     : ["Mån", "Tis", "Ons", "Tor", "Fre", "Lör", "Sön"];
  
  return { dayNames };
};
