
import { Task, TaskCategory } from '../types';

const UI_TRANSLATIONS = {
  sv: {
    titleDay: 'Dagsschema',
    titleWeek: 'Veckoöversikt',
    date: 'Idag',
    justNu: 'Just nu',
    newTask: 'Ny uppgift',
    filterLabel: 'Filter:',
    missedTitle: 'Missade uppgifter igår',
    missedButton: 'Visa rapport',
    clearFilters: 'Rensa',
    dayTime: 'Dag',
    eveningTime: 'Kväll',
    nightTime: 'Natt',
    morningTime: 'Morgon',
    undo: 'Ångra',
    done: 'Klar',
    seePlan: 'Se genomförandeplan',
    subTitle: 'VIKARIEINSTRUKTION',
    subModeNotice: 'Du har vikarieläget påslaget. Tryck på korten för att se detaljerade instruktioner, koder och rutiner.',
    sign: 'Signering',
    off: 'Ledig',
    mcssWarning: 'Signering låst. Du måste först öppna MCSS och signera där.',
    openMcss: 'Öppna MCSS (Signera här först)',
    taskDone: 'Denna uppgift är markerad som utförd.',
    markDone: 'Markera klar',
    description: 'Beskrivning',
    reportTo: 'Till vem:',
    reportContent: 'Rapportinnehåll:',
    saveReport: 'Spara & Signera Rapport',
    reportPlaceholder: 'Skriv nattens/dagens händelser här...',
    reportToPlaceholder: 'T.ex. Emma eller Dagpersonal',
    contacts: 'Kontakt',
    manager: 'Chef',
    nurse: 'Sjuksköterska',
    nurseOnCall: 'Sjuksköterska (Jour)',
    coordinator: 'Planeringssamordnare',
    security: 'Jourvakt / Bevakning',
    sbarTitle: 'SBAR - icke-akut',
    sbarIntro: 'Före kontakt - se till att ha relevant information tillhands',
    sbarS: 'Situation',
    sbarB: 'Bakgrund',
    sbarA: 'Aktuellt tillstånd',
    sbarR: 'Rekommendation'
  },
  en: {
    titleDay: 'Daily Schedule',
    titleWeek: 'Weekly Overview',
    date: 'Today',
    justNu: 'Just now',
    newTask: 'New Task',
    filterLabel: 'Filter:',
    missedTitle: 'Missed tasks yesterday',
    missedButton: 'View Report',
    clearFilters: 'Clear',
    dayTime: 'Day',
    eveningTime: 'Evening',
    nightTime: 'Night',
    morningTime: 'Morning',
    undo: 'Undo',
    done: 'Done',
    seePlan: 'See implementation plan',
    subTitle: 'SUBSTITUTE NOTE',
    subModeNotice: 'Substitute mode is on. Tap cards for detailed instructions, codes, and routines.',
    sign: 'Signing',
    off: 'Off',
    mcssWarning: 'Signing locked. You must first open MCSS and sign there.',
    openMcss: 'Open MCSS (Sign here first)',
    taskDone: 'This task is marked as completed.',
    markDone: 'Mark as done',
    description: 'Description',
    reportTo: 'To whom:',
    reportContent: 'Report content:',
    saveReport: 'Save & Sign Report',
    reportPlaceholder: 'Write day/night events here...',
    reportToPlaceholder: 'E.g. Emma or Day staff',
    contacts: 'Contacts',
    manager: 'Manager',
    nurse: 'Nurse',
    nurseOnCall: 'Nurse (On-call)',
    coordinator: 'Planning Coordinator',
    security: 'Security / Night Watch',
    sbarTitle: 'SBAR - Non-acute',
    sbarIntro: 'Before contact - ensure you have relevant information ready',
    sbarS: 'Situation',
    sbarB: 'Background',
    sbarA: 'Assessment',
    sbarR: 'Recommendation'
  },
  ar: {
    titleDay: 'الجدول اليومي',
    titleWeek: 'نظرة عامة أسبوعية',
    date: 'اليوم',
    justNu: 'الآن',
    newTask: 'إضافة مهمة',
    filterLabel: 'تصفية:',
    missedTitle: 'مهام فائتة بالأمس',
    missedButton: 'عرض التقرير',
    clearFilters: 'مسح',
    dayTime: 'نهار',
    eveningTime: 'مساء',
    nightTime: 'ليل',
    morningTime: 'صباح',
    undo: 'تراجع',
    done: 'تم',
    seePlan: 'انظر خطة التنفيذ',
    subTitle: 'تعليمات البديل',
    subModeNotice: 'وضع البديل قيد التشغيل. اضغط على البطاقات للحصول على تعليمات مفصلة وأكواد وروتين.',
    sign: 'توقيع',
    off: 'عطلة',
    mcssWarning: 'التوقيع مغلق. يجب فتح MCSS أولاً.',
    openMcss: 'فتح MCSS (وقع هنا أولاً)',
    taskDone: 'تم تنفيذ هذه المهمة.',
    markDone: 'تحديد كمكتمل',
    description: 'الوصف',
    reportTo: 'إلى من:',
    reportContent: 'محتوى التقرير:',
    saveReport: 'حفظ وتوقيع التقرير',
    reportPlaceholder: 'اكتب أحداث اليوم/الليل هنا...',
    reportToPlaceholder: 'مثلاً إيما أو موظفي النهار',
    contacts: 'اتصال',
    manager: 'مدير',
    nurse: 'ممرض',
    nurseOnCall: 'ممرض (طوارئ)',
    coordinator: 'منسق التخطيط',
    security: 'الأمن / الحراسة',
    sbarTitle: 'SBAR - غير حاد',
    sbarIntro: 'قبل الاتصال - تأكد من توفر المعلومات ذات الصلة',
    sbarS: 'الموقف',
    sbarB: 'الخلفية',
    sbarA: 'التقييم',
    sbarR: 'التوصية'
  },
  es: {
    titleDay: 'Horario Diario',
    titleWeek: 'Resumen Semanal',
    date: 'Hoy',
    justNu: 'Ahora mismo',
    newTask: 'Nueva Tarea',
    filterLabel: 'Filtrar:',
    missedTitle: 'Tareas perdidas ayer',
    missedButton: 'Ver Informe',
    clearFilters: 'Borrar',
    dayTime: 'Día',
    eveningTime: 'Tarde',
    nightTime: 'Noche',
    morningTime: 'Mañana',
    undo: 'Deshacer',
    done: 'Hecho',
    seePlan: 'Ver plan de ejecución',
    subTitle: 'INSTRUCCIÓN SUPLENTE',
    subModeNotice: 'Modo suplente activado. Toque las tarjetas para ver instrucciones detaladas, códigos och rutinas.',
    sign: 'Firma',
    off: 'Libre',
    mcssWarning: 'Firma bloqueada. Primero debe abrir MCSS.',
    openMcss: 'Abrir MCSS (Firmar aquí primero)',
    taskDone: 'Esta tarea está completada.',
    markDone: 'Marcar como hecho',
    description: 'Descripción',
    reportTo: 'Para quién:',
    reportContent: 'Contenido del informe:',
    saveReport: 'Guardar y firmar informe',
    reportPlaceholder: 'Escribe los eventos del día/noche aquí...',
    reportToPlaceholder: 'Ej. Emma o personal de mañana',
    contacts: 'Contacto',
    manager: 'Jefe',
    nurse: 'Enfermera',
    nurseOnCall: 'Enfermera (Guardia)',
    coordinator: 'Coordinador',
    security: 'Seguridad / Guardia',
    sbarTitle: 'SBAR - No agudo',
    sbarIntro: 'Antes del contacto - asegúrese de tener la información relevante lista',
    sbarS: 'Situación',
    sbarB: 'Antecedentes',
    sbarA: 'Evaluación',
    sbarR: 'Recomendación'
  }
};

const TITLE_MAP: Record<string, Record<string, string>> = {
  'HSL Insats': { sv: 'HSL Insats', en: 'Medical Task', ar: 'مهمة طبية', es: 'Tarea HSL' },
  'Morgonhygien': { sv: 'Morgonhygien', en: 'Morning Hygiene', ar: 'النظافة الصباحية', es: 'Higiene Matinal' },
  'Frukoststöd': { sv: 'Frukoststöd', en: 'Breakfast Support', ar: 'دعم الإفطار', es: 'Apoyo Desayuno' },
  'Läkemedelsöverlämning': { sv: 'Läkemedelsöverlämning', en: 'Medication Handover', ar: 'تسليم الدواء', es: 'Entrega de Medicinas' },
  'Aktivitet: Promenad': { sv: 'Aktivitet: Promenad', en: 'Activity: Walk', ar: 'نشاط: مشi', es: 'Actividad: Paseo' },
  'Morgonrapport': { sv: 'Morgonrapport', en: 'Morning Report', ar: 'تقرير الصباح', es: 'Informe de Mañana' },
  'Läkemedel': { sv: 'Läkemedel', en: 'Medication', ar: 'الأدوية', es: 'Medicamentos' },
  'Sophantering': { sv: 'Sophantering', en: 'Waste Mgmt', ar: 'إدارة النفايات', es: 'Gestión Residuos' },
  'Bakning': { sv: 'Bakning', en: 'Baking', ar: 'خبز', es: 'Repostería' },
  'Dokumentation': { sv: 'Dokumentation', en: 'Documentation', ar: 'توثiq', es: 'Documentación' },
  'Middagsstöd': { sv: 'Middagsstöd', en: 'Dinner Support', ar: 'دعم العشاء', es: 'Apoyo Cena' },
  'Social samvaro': { sv: 'Social samvaro', en: 'Social Interaction', ar: 'تفاعل اجتماعي', es: 'Interacción Social' },
  'Kvällshygien': { sv: 'Kvällshygien', en: 'Evening Hygiene', ar: 'النظافة المسائية', es: 'Higiene de Tarde' },
  'Diskhantering': { sv: 'Diskhantering', en: 'Dishwashing', ar: 'غسل الأطباق', es: 'Lavar Platos' },
  'Kvällsfika': { sv: 'Kvällsfika', en: 'Evening Coffee', ar: 'قهوة المساء', es: 'Merienda Cena' },
  'Filmkväll': { sv: 'Filmkväll', en: 'Movie Night', ar: 'ليلة الفيلم', es: 'Noche de Cine' },
  'Larmkontroll': { sv: 'Larmkontroll', en: 'Alarm Check', ar: 'فحص الإنذار', es: 'Control de Alarmas' },
  'Tillsyn Natt': { sv: 'Tillsyn Natt', en: 'Night Check', ar: 'مراقبة ليلية', es: 'Control Nocturno' },
  'Tvätthantering': { sv: 'Tvätthantering', en: 'Laundry', ar: 'غسيل الملابس', es: 'Lavandería' },
  'Nattrapport': { sv: 'Nattrapport', en: 'Night Report', ar: 'تقرير الليل', es: 'Informe Nocturno' },
  'Frukostförberedelse': { sv: 'Frukostförberedelse', en: 'Breakfast Prep', ar: 'تحضير الإفطار', es: 'Prep. Desayuno' },
  'Personlig Hygien': { sv: 'Personlig Hygien', en: 'Personal Care', ar: 'النظافة الشخصية', es: 'Cuidado Personal' },
  'Aktivitet: Högläsning': { sv: 'Aktivitet: Högläsning', en: 'Activity: Reading', ar: 'نشاط: قراءة', es: 'Actividad: Lectura' },
  'Blodtryck': { sv: 'Blodtryck', en: 'Blood Pressure', ar: 'ضغط الدم', es: 'Presión Arterial' },
  'Varumottagning': { sv: 'Varumottagning', en: 'Deliveries', ar: 'استلام البضائع', es: 'Entregas' },
  'Administrativt': { sv: 'Administrativt', en: 'Admin Work', ar: 'عمل إداري', es: 'Trabajo Admin' },
  'Aktivitet: Musikstund': { sv: 'Aktivitet: Musikstund', en: 'Music Session', ar: 'جلسة موسيقى', es: 'Sesión de Música' },
  'Aktivitet: Gymnastik': { sv: 'Aktivitet: Gymnastik', en: 'Activity: Exercise', ar: 'نشاط: رياضة', es: 'Actividad: Gimnasia' },
  'Förrådspåfyllning': { sv: 'Förrådspåfyllning', en: 'Stock Refill', ar: 'تعبئة المستودع', es: 'Reposición Stock' },
  'Säkerhetscheck': { sv: 'Säkerhetscheck', en: 'Security Check', ar: 'فحص أمني', es: 'Control Seguridad' },
  'Kaffebryggning': { sv: 'Kaffebryggning', en: 'Brewing Coffee', ar: 'تحضير القهوة', es: 'Preparar Café' },
  'Säkerhetsrond': { sv: 'Säkerhetsrond', en: 'Safety Round', ar: 'جولة أمان', es: 'Ronda de Seguridad' }
};

const DESCRIPTION_MAP: Record<string, Record<string, string>> = {
  'Skriv överlämning till kvällspasset.': { sv: 'Skriv överlämning till kvällspasset.', en: 'Write handover to evening shift.', ar: 'كتابة تسليم الوردية المسائية.', es: 'Escribir entrega al turno de tarde.' },
  'Skriva i Lifecare.': { sv: 'Skriva i Lifecare.', en: 'Write in Lifecare.', ar: 'الكتابة في Lifecare.', es: 'Escribir en Lifecare.' },
  'Servering och stöd vid middag.': { sv: 'Servering och stöd vid middag.', en: 'Serving and support at dinner.', ar: 'الخدمة والدعم في العشاء.', es: 'Servicio y apoyo en la cena.' },
  'Plocka in i diskmaskin.': { sv: 'Plocka in i diskmaskin.', en: 'Load dishwasher.', ar: 'تعبئة غسالة الصحون.', es: 'Cargar lavavajillas.' },
  'Duka fram kaffe och smörgås.': { sv: 'Duka fram kaffe och smörgås.', en: 'Serve coffee and sandwich.', ar: 'تقديم القهوة والشطائر.', es: 'Servir café y sándwich.' },
  'Gemensam aktivitet i tv-rummet.': { sv: 'Gemensam aktivitet i tv-rummet.', en: 'Joint activity in TV room.', ar: 'نشاط مشترك في غرفة التلفزيون.', es: 'Actividad conjunta en sala TV.' },
  'Vika handdukar.': { sv: 'Vika handdukar.', en: 'Fold towels.', ar: 'طي المناشف.', es: 'Doblar toallas.' },
  'Skriv överlämning till dagpersonal.': { sv: 'Skriv överlämning till dagpersonal.', en: 'Write handover to day staff.', ar: 'كتابة تسليم الموظفين الصباحيين.', es: 'Escribir entrega a mañana.' },
  'Duka fram tallrikar.': { sv: 'Duka fram tallrikar.', en: 'Set out plates.', ar: 'تجهيز الأطباق.', es: 'Preparar platos.' },
  'Beställa skyddsmaterial.': { sv: 'Beställa skyddsmaterial.', en: 'Order protective gear.', ar: 'طلب مواد الحماية.', es: 'Pedir material protección.' },
  'Lås alla ytterdörrar.': { sv: 'Lås alla ytterdörrar.', en: 'Lock all outer doors.', ar: 'قفل جميع الأبواب الخارجية.', es: 'Cerrar puertas exteriores.' },
  'Förbered fika.': { sv: 'Förbered fika.', en: 'Prepare coffee break.', ar: 'تحضير القهوة.', es: 'Preparar merienda.' },
  'Sittgympa i dagrummet.': { sv: 'Sittgympa i dagrummet.', en: 'Chair exercise in day room.', ar: 'رياضة جلوس في غرفة النهار.', es: 'Gimnasia en sala de día.' },
  'Fylla på handskar/förkläden.': { sv: 'Fylla på handskar/förkläden.', en: 'Refill gloves/aprons.', ar: 'تعبئة القفازات والمآزر.', es: 'Reposición guantes/delantales.' },
  'Tömma inkontinensavfall.': { sv: 'Tömma inkontinensavfall.', en: 'Empty incontinence waste.', ar: 'تفريغ نفايات السلس.', es: 'Vaciar residuos incontinencia.' },
  'Överlämning till dag.': { sv: 'Överlämning till dag.', en: 'Handover to day shift.', ar: 'التسليم للصباح.', es: 'Entrega a la mañana.' },
  'Töm diskmaskin i pentryt.': { sv: 'Töm diskmaskin i pentryt.', en: 'Empty dishwasher in pantry.', ar: 'تفريغ غسالة الصحون.', es: 'Vaciar lavavajillas despensa.' },
  'Förbered frukostkaffe.': { sv: 'Förbered frukostkaffe.', en: 'Prepare breakfast coffee.', ar: 'تحضير قهوة الإفطار.', es: 'Preparar café desayuno.' }
};

const SUB_INSTR_MAP: Record<string, Record<string, string>> = {
  'Tagg till medicinskåp hänger på nyckeltavlan i personalrummet. Kod: 1234.': {
    sv: 'Tagg till medicinskåp hänger på nyckeltavlan i personalrummet. Kod: 1234.',
    en: 'Medical cabinet tag is on the key board in staff room. Code: 1234.',
    ar: 'علامة خزانة الأدوية موجودة على لوحة المفاتيح في غرفة الموظفين. الكود: 1234.',
    es: 'La etiqueta del gabinete médico está en el tablero de llaves. Código: 1234.'
  },
  'Använd alltid taklyften. Brukaren blir lugn av att man berättar vad man gör.': {
    sv: 'Använd alltid taklyften. Brukaren blir lugn av att man berättar vad man gör.',
    en: 'Always use ceiling lift. The resident stays calm if you explain what you do.',
    ar: 'استخدم دائماً رافعة السقف. يهدأ المقيم إذا شرحت له ما تفعله.',
    es: 'Usar siempre el elevador de techo. El residente se calma si explicas lo que haces.'
  },
  'Kontrollera i MCSS att morgondosen är tagen först.': {
    sv: 'Kontrollera i MCSS att morgondosen är tagen först.',
    en: 'Check in MCSS that morning dose is taken first.',
    ar: 'تحقق من MCSS أن جرعة الصباح قد تم تناولها أولاً.',
    es: 'Comprobar en MCSS att la dosis matinal se haya tomado primero.'
  },
  'Kontakta alltid sjuksköterska i beredskap innan du ger vb-medicin.': {
    sv: 'Kontakta alltid sjuksköterska i beredskap innan du ger vb-medicin.',
    en: 'Always contact nurse on call before giving as-needed medicine.',
    ar: 'اتصل دائماً بالممرضة المناوبة قبل إعطاء الدواء عند الحاجة.',
    es: 'Contactar siempre con la enfermera de guardia antes de dar medicina de refuerzo.'
  },
  'Ytterdörrarna i källaren glöms ofta bort, dubbelkolla dem.': {
    sv: 'Ytterdörrarna i källaren glöms ofta bort, dubbelkolla dem.',
    en: 'The basement outer doors are often forgotten, double check them.',
    ar: 'غالبًا ما تُنسى الأبواب الخارجية للقبو، تأكد من فحصها جيداً.',
    es: 'Las puertas del sótano a menudo se olvidan, verifíquelas dos veces.'
  },
  'Gå in tyst, tänd inte i taket. Använd ficklampa vid behov.': {
    sv: 'Gå in tyst, tänd inte i taket. Använd ficklampa vid behov.',
    en: 'Enter quietly, do not turn on ceiling light. Use flashlight if needed.',
    ar: 'ادخل بهدوء، لا تشعل ضوء السقف. استخدم مصباحاً يدوياً عند الضرورة.',
    es: 'Entre en silencio, no encienda la luz del techo. Use linterna si es necesario.'
  }
};

export function getUITranslations(lang: string) {
  return UI_TRANSLATIONS[lang as keyof typeof UI_TRANSLATIONS] || UI_TRANSLATIONS.sv;
}

export function translateTasks(tasks: Task[], lang: string): Task[] {
  return tasks.map(task => {
    let title = task.title;
    let description = task.description || '';
    let subInfo = task.substituteInstructions || '';

    if (TITLE_MAP[task.title]) {
      title = TITLE_MAP[task.title][lang] || task.title;
    }

    if (description.includes('hänvisning till MCSS')) {
      const match = description.match(/(\d+)/);
      const nr = match ? match[0] : '?';
      if (lang === 'ar') description = `المقيم رقم ${nr}، مراجعة MCSS`;
      else if (lang === 'en') description = `Resident no ${nr}, refer to MCSS`;
      else if (lang === 'es') description = `Residente nº ${nr}, ver MCSS`;
      else description = `Boende nr ${nr}, hänvisning till MCSS`;
    } else if (DESCRIPTION_MAP[description]) {
      description = DESCRIPTION_MAP[description][lang] || description;
    }

    if (SUB_INSTR_MAP[subInfo]) {
      subInfo = SUB_INSTR_MAP[subInfo][lang] || subInfo;
    }

    return { 
      ...task, 
      title, 
      description,
      substituteInstructions: subInfo
    };
  });
}

export function getCategoryLabel(category: string, lang: string): string {
  const CATEGORY_TRANSLATIONS: Record<string, Record<string, string>> = {
    hsl: { sv: 'HSL', en: 'Medical', ar: 'طبي', es: 'Médico' },
    care: { sv: 'Omsorg', en: 'Care', ar: 'رعاية', es: 'Cuidado' },
    service: { sv: 'Service', en: 'Service', ar: 'خدمة', es: 'Servicio' },
    social: { sv: 'Socialt', en: 'Social', ar: 'اجتماعي', es: 'Social' },
    admin: { sv: 'Admin', en: 'Admin', ar: 'إداري', es: 'Admin' }
  };
  return CATEGORY_TRANSLATIONS[category]?.[lang] || category;
}
