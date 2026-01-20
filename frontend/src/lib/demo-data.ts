
import { Person, Task, TaskCategory, TaskStatus, Unit } from '../types';

export const UNITS: Unit[] = [
  { id: 'u1', name: 'Daglig verksamhet Kronan', type: 'LSS' },
  { id: 'u2', name: 'SÄBO Källstorpsgården', type: 'SÄBO' },
];

export const STAFF: Person[] = [
  // --- UNIT 1: KRONAN (LSS) - 9 Staff ---
  { id: 's1', name: 'Emma Andersson', role: 'Undersköterska', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', teamColor: 'red', unitId: 'u1' },
  { id: 's2', name: 'Johan Berg', role: 'Vårdbiträde', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Johan', teamColor: 'blue', unitId: 'u1' },
  { id: 's3', name: 'Maria Carlsson', role: 'Sjuksköterska', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', teamColor: 'purple', unitId: 'u1' },
  { id: 's4', name: 'Anders Danielsson', role: 'Undersköterska', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anders', teamColor: 'red', unitId: 'u1' },
  { id: 's10', name: 'Sofia Lindkvist', role: 'Undersköterska', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia', teamColor: 'blue', unitId: 'u1' },
  { id: 's11', name: 'Lukas Ek', role: 'Vårdbiträde', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lukas', teamColor: 'red', unitId: 'u1' },
  { id: 's12', name: 'Elsa Holm', role: 'Undersköterska', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elsa', teamColor: 'blue', unitId: 'u1' },
  { id: 's13', name: 'Nils Sjögren', role: 'Vårdbiträde', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nils', teamColor: 'red', unitId: 'u1' },
  { id: 's14', name: 'Klara Wallin', role: 'Undersköterska', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Klara', teamColor: 'blue', unitId: 'u1' },

  // --- UNIT 2: KÄLLSTORPSGÅRDEN (SÄBO) - 10 Staff ---
  { id: 's5', name: 'Karim Al-Fayed', role: 'Vårdbiträde', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Karim', teamColor: 'blue', unitId: 'u2' },
  { id: 's6', name: 'Lena Svensson', role: 'Sjuksköterska', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lena', teamColor: 'purple', unitId: 'u2' },
  { id: 's7', name: 'Olof Palme', role: 'Undersköterska', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olof', teamColor: 'white', unitId: 'u2' },
  { id: 's15', name: 'Sven Bertilsson', role: 'Undersköterska', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sven', teamColor: 'red', unitId: 'u2' },
  { id: 's16', name: 'Birgitta Qvist', role: 'Vårdbiträde', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Birgitta', teamColor: 'blue', unitId: 'u2' },
  { id: 's17', name: 'Eva Dahl', role: 'Undersköterska', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Eva', teamColor: 'red', unitId: 'u2' },
  { id: 's18', name: 'Lars Malm', role: 'Vårdbiträde', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lars', teamColor: 'blue', unitId: 'u2' },
  { id: 's19', name: 'Monica Berg', role: 'Undersköterska', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Monica', teamColor: 'red', unitId: 'u2' },
  { id: 's20', name: 'Per Ström', role: 'Vårdbiträde', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Per', teamColor: 'blue', unitId: 'u2' },
  { id: 's21', name: 'Kerstin Falk', role: 'Sjuksköterska', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kerstin', teamColor: 'purple', unitId: 'u2' },
];

export const USERS: Person[] = [
  { id: 'b1', name: 'Brukare nr 1', role: 'Brukare', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=B1' },
  { id: 'b2', name: 'Brukare nr 2', role: 'Brukare', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=B2' },
  { id: 'b3', name: 'Brukare nr 3', role: 'Brukare', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=B3' },
  { id: 'b4', name: 'Brukare nr 4', role: 'Brukare', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=B4' },
];

export const TASKS: Task[] = [
  // ===========================================================================
  // UNIT 1: KRONAN (LSS)
  // ===========================================================================

  // --- MORNING RED (U1) ---
  { id: 'u1-mr1', unitId: 'u1', title: 'HSL Insats', description: 'Boende nr 1, hänvisning till MCSS', substituteInstructions: 'Tagg till medicinskåp hänger på nyckeltavlan i personalrummet. Kod: 1234.', timeStart: '07:00', timeEnd: '07:30', category: TaskCategory.HSL, status: TaskStatus.PENDING, shiftRole: 'morning_red', requiresSign: true },
  { id: 'u1-mr2', unitId: 'u1', title: 'Morgonhygien', description: 'Boende nr 1. Dusch och påklädning.', substituteInstructions: 'Använd alltid taklyften. Brukaren blir lugn av att man berättar vad man gör.', timeStart: '07:30', timeEnd: '08:30', category: TaskCategory.CARE, status: TaskStatus.PENDING, shiftRole: 'morning_red' },
  { id: 'u1-mr3', unitId: 'u1', title: 'Frukoststöd', description: 'Duka och servera frukost för röd grupp.', substituteInstructions: 'Specialkost: Lgh 02 ska ha laktosfri mjölk, står längst in i kylen.', timeStart: '09:00', timeEnd: '10:00', category: TaskCategory.CARE, status: TaskStatus.PENDING, shiftRole: 'morning_red' },
  { id: 'u1-mr4', unitId: 'u1', title: 'HSL Insats', description: 'Boende nr 3, hänvisning till MCSS', substituteInstructions: 'Ska tas tillsammans med ett glas juice. Juicen finns i skafferiet.', timeStart: '10:30', timeEnd: '11:00', category: TaskCategory.HSL, status: TaskStatus.PENDING, shiftRole: 'morning_red', requiresSign: true },
  { id: 'u1-mr5', unitId: 'u1', title: 'Aktivitet: Promenad', description: 'Utevisstelse med boende nr 1.', substituteInstructions: 'Glöm inte att ta med brukartelefonen. Brukaren gillar att gå mot kanalen.', timeStart: '13:30', timeEnd: '14:30', category: TaskCategory.SOCIAL, status: TaskStatus.PENDING, shiftRole: 'morning_red' },
  { id: 'u1-mr-rep', unitId: 'u1', title: 'Morgonrapport', description: 'Skriv överlämning till kvällspasset.', substituteInstructions: 'Använd mallen "Överlämning" i systemet. Var noga med att nämna ev. avvikelser.', timeStart: '15:30', timeEnd: '16:00', category: TaskCategory.ADMIN, status: TaskStatus.PENDING, shiftRole: 'morning_red', isReportTask: true, reportType: 'day_to_evening' },

  // --- MORNING BLUE (U1) ---
  { id: 'u1-mb1', unitId: 'u1', title: 'HSL Insats', description: 'Boende nr 2, hänvisning till MCSS', substituteInstructions: 'Medicinvagnen står i korridor B. Kod 2025.', timeStart: '07:15', timeEnd: '07:45', category: TaskCategory.HSL, status: TaskStatus.PENDING, shiftRole: 'morning_blue', requiresSign: true },
  { id: 'u1-mb2', unitId: 'u1', title: 'Morgonhygien', description: 'Boende nr 2. Personlig vård.', substituteInstructions: 'Tandborstning är viktig, använd den mjuka borsten i skåpet.', timeStart: '07:45', timeEnd: '08:45', category: TaskCategory.CARE, status: TaskStatus.PENDING, shiftRole: 'morning_blue' },
  { id: 'u1-mb3', unitId: 'u1', title: 'Sophantering', description: 'Tömma sopor i samtliga lägenheter.', substituteInstructions: 'Nyckel till soprummet sitter på den gemensamma nyckelknippan (blå tagg).', timeStart: '09:00', timeEnd: '09:45', category: TaskCategory.SERVICE, status: TaskStatus.PENDING, shiftRole: 'morning_blue' },
  { id: 'u1-mb4', unitId: 'u1', title: 'Bakning', description: 'Aktivitet med boende i köket.', substituteInstructions: 'Ingredienser finns i skåp märkt "Aktivitet". Förkläden hänger bakom dörren.', timeStart: '10:30', timeEnd: '12:00', category: TaskCategory.SOCIAL, status: TaskStatus.PENDING, shiftRole: 'morning_blue' },
  { id: 'u1-mb5', unitId: 'u1', title: 'Dokumentation', description: 'Skriva i Lifecare.', substituteInstructions: 'Logga in med ditt SITHS-kort. Se till att signera dagens anteckningar innan du går.', timeStart: '14:00', timeEnd: '15:00', category: TaskCategory.ADMIN, status: TaskStatus.PENDING, shiftRole: 'morning_blue' },

  // --- EVENING RED (U1) ---
  { id: 'u1-er1', unitId: 'u1', title: 'Middagsstöd', description: 'Servering och stöd vid middag.', substituteInstructions: 'Duka för 4 personer. Se till att alla har sina haklappar redo.', timeStart: '16:30', timeEnd: '17:30', category: TaskCategory.CARE, status: TaskStatus.PENDING, shiftRole: 'evening_red' },
  { id: 'u1-er2', unitId: 'u1', title: 'HSL Insats', description: 'Boende nr 1, hänvisning till MCSS', substituteInstructions: 'Kontrollera i MCSS att morgondosen är tagen först.', timeStart: '18:00', timeEnd: '18:30', category: TaskCategory.HSL, status: TaskStatus.PENDING, shiftRole: 'evening_red', requiresSign: true },
  { id: 'u1-er3', unitId: 'u1', title: 'Social samvaro', description: 'Spela spel med boende nr 3.', substituteInstructions: 'Favoritspelet är Fia med knuff, finns i hyllan vid TV:n.', timeStart: '19:00', timeEnd: '20:00', category: TaskCategory.SOCIAL, status: TaskStatus.PENDING, shiftRole: 'evening_red' },
  { id: 'u1-er4', unitId: 'u1', title: 'Kvällshygien', description: 'Boende nr 1. Förberedelse natt.', substituteInstructions: 'Brukaren vill ha dörren lite på glänt och nattlampan tänd.', timeStart: '20:00', timeEnd: '21:00', category: TaskCategory.CARE, status: TaskStatus.PENDING, shiftRole: 'evening_red' },
  { id: 'u1-er5', unitId: 'u1', title: 'Diskhantering', description: 'Plocka in i diskmaskin.', substituteInstructions: 'Diskmedelstabletter finns under vasken i den låsta lådan (kod 55).', timeStart: '21:00', timeEnd: '21:30', category: TaskCategory.SERVICE, status: TaskStatus.PENDING, shiftRole: 'evening_red' },

  // --- EVENING BLUE (U1) ---
  { id: 'u1-eb1', unitId: 'u1', title: 'Kvällsfika', description: 'Duka fram kaffe och smörgås.', substituteInstructions: 'Brygg 6 koppar. Glöm inte det sockerfria alternativet till lgh 04.', timeStart: '15:30', timeEnd: '16:15', category: TaskCategory.CARE, status: TaskStatus.PENDING, shiftRole: 'evening_blue' },
  { id: 'u1-eb2', unitId: 'u1', title: 'Filmkväll', description: 'Gemensam aktivitet i tv-rummet.', substituteInstructions: 'Fjärrkontrollen ligger i den översta lådan i mediabänken.', timeStart: '18:30', timeEnd: '20:00', category: TaskCategory.SOCIAL, status: TaskStatus.PENDING, shiftRole: 'evening_blue' },
  { id: 'u1-eb3', unitId: 'u1', title: 'Kvällshygien', description: 'Boende nr 4.', substituteInstructions: 'Använd den blå tvättlappen för ansiktet och den vita för kroppen.', timeStart: '20:15', timeEnd: '21:00', category: TaskCategory.CARE, status: TaskStatus.PENDING, shiftRole: 'evening_blue' },
  { id: 'u1-eb4', unitId: 'u1', title: 'HSL Insats', description: 'Boende nr 2, hänvisning till MCSS', substituteInstructions: 'Viktigt att brukaren sköljer munnen med vatten efteråt.', timeStart: '21:00', timeEnd: '21:15', category: TaskCategory.HSL, status: TaskStatus.PENDING, shiftRole: 'evening_blue', requiresSign: true },
  { id: 'u1-eb5', unitId: 'u1', title: 'Larmkontroll', description: 'Kontrollera att bärbara larm laddas.', substituteInstructions: 'Laddstationen sitter i hallen. Alla gröna lampor ska lysa.', timeStart: '21:30', timeEnd: '21:45', category: TaskCategory.SERVICE, status: TaskStatus.PENDING, shiftRole: 'evening_blue' },

  // --- NIGHT RED (U1) ---
  { id: 'u1-nr1', unitId: 'u1', title: 'HSL Insats', description: 'Boende nr 1, hänvisning till MCSS', substituteInstructions: 'Kontakta alltid sjuksköterska i beredskap innan du ger vb-medicin.', timeStart: '22:00', timeEnd: '22:30', category: TaskCategory.HSL, status: TaskStatus.PENDING, shiftRole: 'night_red', requiresSign: true },
  { id: 'u1-nr2', unitId: 'u1', title: 'Tillsyn Natt', description: 'Runda 1. Kontroll av dörrar.', substituteInstructions: 'Ytterdörrarna i källaren glöms ofta bort, dubbelkolla dem.', timeStart: '00:00', timeEnd: '00:30', category: TaskCategory.SERVICE, status: TaskStatus.PENDING, shiftRole: 'night_red' },
  { id: 'u1-nr3', unitId: 'u1', title: 'Tillsyn Natt', description: 'Runda 2. Extra koll lgh 05.', substituteInstructions: 'Gå in tyst, tänd inte i taket. Använd ficklampa vid behov.', timeStart: '03:00', timeEnd: '03:30', category: TaskCategory.CARE, status: TaskStatus.PENDING, shiftRole: 'night_red' },
  { id: 'u1-nr4', unitId: 'u1', title: 'Tvätthantering', description: 'Vika handdukar.', substituteInstructions: 'Rena handdukar läggs i det stora vita skåpet i korridoren.', timeStart: '04:30', timeEnd: '05:30', category: TaskCategory.SERVICE, status: TaskStatus.PENDING, shiftRole: 'night_red' },
  { id: 'u1-nr5', unitId: 'u1', title: 'Nattrapport', description: 'Skriv överlämning till dagpersonal.', substituteInstructions: 'Viktigt att notera om lgh 01 varit vaken mycket under natten.', timeStart: '06:30', timeEnd: '07:00', category: TaskCategory.ADMIN, status: TaskStatus.PENDING, shiftRole: 'night_red', isReportTask: true, reportType: 'night_to_day' },

  // --- NIGHT BLUE (U1) ---
  { id: 'u1-nb1', unitId: 'u1', title: 'HSL Insats', description: 'Boende nr 3, hänvisning till MCSS', substituteInstructions: 'Kod till kylskåpet för insulin: 9988.', timeStart: '22:15', timeEnd: '22:45', category: TaskCategory.HSL, status: TaskStatus.PENDING, shiftRole: 'night_blue', requiresSign: true },
  { id: 'u1-nb2', unitId: 'u1', title: 'Tillsyn Natt', description: 'Runda 1. Kontrollera fönster.', substituteInstructions: 'Fönstren i allrummet ska vara stängda och låsta efter kl 23:00.', timeStart: '23:30', timeEnd: '00:00', category: TaskCategory.SERVICE, status: TaskStatus.PENDING, shiftRole: 'night_blue' },
  { id: 'u1-nb3', unitId: 'u1', title: 'Tillsyn Natt', description: 'Runda 2. Blöjbyte vid behov.', substituteInstructions: 'Inkontinensskydd finns i förrådet bakom expeditionen.', timeStart: '02:00', timeEnd: '03:00', category: TaskCategory.CARE, status: TaskStatus.PENDING, shiftRole: 'night_blue' },
  { id: 'u1-nb4', unitId: 'u1', title: 'Dokumentation', description: 'Skriv nattens händelser i Lifecare.', substituteInstructions: 'Använd korta, sakliga meningar. Glöm inte att spara ofta.', timeStart: '04:00', timeEnd: '05:00', category: TaskCategory.ADMIN, status: TaskStatus.PENDING, shiftRole: 'night_blue' },
  { id: 'u1-nb5', unitId: 'u1', title: 'Frukostförberedelse', description: 'Duka fram tallrikar.', substituteInstructions: 'Porslinet står i de nedre skåpen i köket. Duka för 8 personer.', timeStart: '06:00', timeEnd: '06:45', category: TaskCategory.SERVICE, status: TaskStatus.PENDING, shiftRole: 'night_blue' },

  // ===========================================================================
  // UNIT 2: KÄLLSTORPSGÅRDEN (SÄBO)
  // ===========================================================================

  // --- MORNING RED (U2) ---
  { id: 'u2-mr1', unitId: 'u2', title: 'HSL Insats', description: 'Boende nr 5, hänvisning till MCSS', substituteInstructions: 'Kod till vagn: 2024. Insulinpennorna är märkta med namn.', timeStart: '07:00', timeEnd: '07:30', category: TaskCategory.HSL, status: TaskStatus.PENDING, shiftRole: 'morning_red', requiresSign: true },
  { id: 'u2-mr2', unitId: 'u2', title: 'Personlig Hygien', description: 'Boende nr 5. Duschdag.', substituteInstructions: 'Använd glidlakan vid förflyttning. Handdukar finns i linneskåpet utanför rummet.', timeStart: '07:30', timeEnd: '08:30', category: TaskCategory.CARE, status: TaskStatus.PENDING, shiftRole: 'morning_red' },
  { id: 'u2-mr3', unitId: 'u2', title: 'Frukoststöd', description: 'Servering i matsalen.', substituteInstructions: 'Många vill ha sin gröt varmare än kaffet. Fråga alltid boende om de vill ha mjölk.', timeStart: '09:00', timeEnd: '10:00', category: TaskCategory.CARE, status: TaskStatus.PENDING, shiftRole: 'morning_red' },
  { id: 'u2-mr4', unitId: 'u2', title: 'Aktivitet: Högläsning', description: 'Läs tidningen för boende.', substituteInstructions: 'Trollhättans tidning ligger på bordet vid entrén. Läs gärna lokala nyheter först.', timeStart: '11:00', timeEnd: '11:45', category: TaskCategory.SOCIAL, status: TaskStatus.PENDING, shiftRole: 'morning_red' },
  { id: 'u2-mr5', unitId: 'u2', title: 'HSL Insats', description: 'Boende nr 7, hänvisning till MCSS', substituteInstructions: 'Manschetten finns i sjuksköterskans rum. Brukaren ska vila 10 min innan mätning.', timeStart: '14:00', timeEnd: '14:30', category: TaskCategory.HSL, status: TaskStatus.PENDING, shiftRole: 'morning_red', requiresSign: true },
  { id: 'u2-mr-rep', unitId: 'u2', title: 'Morgonrapport', description: 'Överlämning till kväll.', substituteInstructions: 'Glöm inte att nämna om sårvården på lgh 08 har blött igenom.', timeStart: '15:15', timeEnd: '15:45', category: TaskCategory.ADMIN, status: TaskStatus.PENDING, shiftRole: 'morning_red', isReportTask: true, reportType: 'day_to_evening' },

  // --- MORNING BLUE (U2) ---
  { id: 'u2-mb1', unitId: 'u2', title: 'Varumottagning', description: 'Packa upp förrådsvaror.', substituteInstructions: 'Följesedeln lämnas till enhetschefen. Tyngsta varorna längst ner i hyllan.', timeStart: '08:00', timeEnd: '09:00', category: TaskCategory.SERVICE, status: TaskStatus.PENDING, shiftRole: 'morning_blue' },
  { id: 'u2-mb2', unitId: 'u2', title: 'HSL Insats', description: 'Boende nr 8, hänvisning till MCSS', substituteInstructions: 'Viktigt: Droppa i vänster öga först, vänta sedan 5 minuter.', timeStart: '09:15', timeEnd: '09:30', category: TaskCategory.HSL, status: TaskStatus.PENDING, shiftRole: 'morning_blue', requiresSign: true },
  { id: 'u2-mb3', unitId: 'u2', title: 'Aktivitet: Bakning', description: 'Gemensam aktivitet.', substituteInstructions: 'Kolla allergilistan i köket. Bullformar finns i den röda burken.', timeStart: '10:30', timeEnd: '12:00', category: TaskCategory.SOCIAL, status: TaskStatus.PENDING, shiftRole: 'morning_blue' },
  { id: 'u2-mb4', unitId: 'u2', title: 'HSL Insats', description: 'Boende nr 6, hänvisning till MCSS', substituteInstructions: 'Använd sterila handskar. Materialet finns i den vita plastbacken.', timeStart: '13:00', timeEnd: '13:45', category: TaskCategory.HSL, status: TaskStatus.PENDING, shiftRole: 'morning_blue', requiresSign: true },
  { id: 'u2-mb5', unitId: 'u2', title: 'Administrativt', description: 'Beställa skyddsmaterial.', substituteInstructions: 'Beställningsportalen nås via intranätet. Använd kst 8821.', timeStart: '15:00', timeEnd: '15:30', category: TaskCategory.ADMIN, status: TaskStatus.PENDING, shiftRole: 'morning_blue' },

  // --- EVENING RED (U2) ---
  { id: 'u2-er1', unitId: 'u2', title: 'Middagsstöd', description: 'Servering enhet A.', substituteInstructions: 'Värm tallrikarna i skåpet först. Se till att alla sitter bekvämt.', timeStart: '16:30', timeEnd: '17:30', category: TaskCategory.CARE, status: TaskStatus.PENDING, shiftRole: 'evening_red' },
  { id: 'u2-er2', unitId: 'u2', title: 'HSL Insats', description: 'Boende nr 5, hänvisning till MCSS', substituteInstructions: 'Ges ofta i samband med kvällsfikat. Se till att brukaren dricker ordentligt.', timeStart: '18:00', timeEnd: '18:30', category: TaskCategory.HSL, status: TaskStatus.PENDING, shiftRole: 'evening_red', requiresSign: true },
  { id: 'u2-er3', unitId: 'u2', title: 'Aktivitet: Musikstund', description: 'Spela skivor i allrummet.', substituteInstructions: 'Skivspelaren har en tendens att hoppa, lägg den på en plan yta.', timeStart: '19:00', timeEnd: '20:00', category: TaskCategory.SOCIAL, status: TaskStatus.PENDING, shiftRole: 'evening_red' },
  { id: 'u2-er4', unitId: 'u2', title: 'Kvällshygien', description: 'Boende nr 6. Tvätt.', substituteInstructions: 'Låt brukaren känna på vattnet innan du börjar tvätta.', timeStart: '20:15', timeEnd: '21:00', category: TaskCategory.CARE, status: TaskStatus.PENDING, shiftRole: 'evening_red' },
  { id: 'u2-er5', unitId: 'u2', title: 'Säkerhetsrond', description: 'Lås alla ytterdörrar.', substituteInstructions: 'Kolla även baksidan av gymmet, dörren dit kan ibland stå på glänt.', timeStart: '21:15', timeEnd: '21:30', category: TaskCategory.SERVICE, status: TaskStatus.PENDING, shiftRole: 'evening_red' },

  // --- EVENING BLUE (U2) ---
  { id: 'u2-eb1', unitId: 'u2', title: 'Kvällsfika', description: 'Förbered fika.', substituteInstructions: 'Häll upp juicen i de små glasen. De som inte tål socker har egna kex.', timeStart: '15:45', timeEnd: '16:30', category: TaskCategory.CARE, status: TaskStatus.PENDING, shiftRole: 'evening_blue' },
  { id: 'u2-eb2', unitId: 'u2', title: 'Aktivitet: Gymnastik', description: 'Sittgympa i dagrummet.', substituteInstructions: 'Sätt på lite glad musik, t.ex. schlager, det uppskattas mest.', timeStart: '18:00', timeEnd: '18:45', category: TaskCategory.SOCIAL, status: TaskStatus.PENDING, shiftRole: 'evening_blue' },
  { id: 'u2-eb3', unitId: 'u2', title: 'HSL Insats', description: 'Boende nr 8, hänvisning till MCSS', substituteInstructions: 'Ges med lite mosad banan för lättare sväljning.', timeStart: '19:30', timeEnd: '20:00', category: TaskCategory.HSL, status: TaskStatus.PENDING, shiftRole: 'evening_blue', requiresSign: true },
  { id: 'u2-eb4', unitId: 'u2', title: 'Kvällshygien', description: 'Boende nr 7.', substituteInstructions: 'Var extra försiktig runt det vänstra benet pga nyligen genomförd operation.', timeStart: '20:30', timeEnd: '21:15', category: TaskCategory.CARE, status: TaskStatus.PENDING, shiftRole: 'evening_blue' },
  { id: 'u2-eb5', unitId: 'u2', title: 'Förrådspåfyllning', description: 'Fylla på handskar/förkläden.', substituteInstructions: 'Skyddsmaterialet finns i det stora förrådet i källaren. Kod: 4433.', timeStart: '21:30', timeEnd: '22:00', category: TaskCategory.SERVICE, status: TaskStatus.PENDING, shiftRole: 'evening_blue' },

  // --- NIGHT RED (U2) ---
  { id: 'u2-nr1', unitId: 'u2', title: 'HSL Insats', description: 'Boende nr 5, hänvisning till MCSS', substituteInstructions: 'Kontrollera i MCSS om det finns några sena ordinationer från kvällen.', timeStart: '22:00', timeEnd: '22:30', category: TaskCategory.HSL, status: TaskStatus.PENDING, shiftRole: 'night_red', requiresSign: true },
  { id: 'u2-nr2', unitId: 'u2', title: 'Tillsyn Natt', description: 'Runda 1. Kontrollera andning lgh 12.', substituteInstructions: 'Gå in väldigt tyst, brukaren är mycket lättväckt.', timeStart: '23:30', timeEnd: '00:30', category: TaskCategory.CARE, status: TaskStatus.PENDING, shiftRole: 'night_red' },
  { id: 'u2-nr3', unitId: 'u2', title: 'Tillsyn Natt', description: 'Runda 2. Blöjkontroll vid behov.', substituteInstructions: 'Använd blöjvagnen som står i korridoren.', timeStart: '03:00', timeEnd: '04:00', category: TaskCategory.CARE, status: TaskStatus.PENDING, shiftRole: 'night_red' },
  { id: 'u2-nr4', unitId: 'u2', title: 'Sophantering', description: 'Tömma inkontinensavfall.', substituteInstructions: 'Påsarna ska knytas ordentligt och slängas i den stora bruna containern.', timeStart: '05:00', timeEnd: '05:45', category: TaskCategory.SERVICE, status: TaskStatus.PENDING, shiftRole: 'night_red' },
  { id: 'u2-nr5', unitId: 'u2', title: 'Nattrapport', description: 'Överlämning till dag.', substituteInstructions: 'Var extra noga med att nämna nattens larmhändelser.', timeStart: '06:30', timeEnd: '07:00', category: TaskCategory.ADMIN, status: TaskStatus.PENDING, shiftRole: 'night_red', isReportTask: true, reportType: 'night_to_day' },

  // --- NIGHT BLUE (U2) ---
  { id: 'u2-nb1', unitId: 'u2', title: 'HSL Insats', description: 'Boende nr 7, hänvisning till MCSS', substituteInstructions: 'Ge endast vb vid stark oro eller smärta. Kontakta sskt vid tvekan.', timeStart: '22:30', timeEnd: '23:00', category: TaskCategory.HSL, status: TaskStatus.PENDING, shiftRole: 'night_blue', requiresSign: true },
  { id: 'u2-nb2', unitId: 'u2', title: 'Säkerhetscheck', description: 'Kontroll av utrymningsvägar.', substituteInstructions: 'Se till att inga rullstolar eller vagnar blockerar dörrarna.', timeStart: '00:00', timeEnd: '00:30', category: TaskCategory.SERVICE, status: TaskStatus.PENDING, shiftRole: 'night_blue' },
  { id: 'u2-nb3', unitId: 'u2', title: 'Tillsyn Natt', description: 'Runda 1. Kontrollera larmknappar.', substituteInstructions: 'Larmknapparna ska sitta fast på sängstolpen, inte ligga på golvet.', timeStart: '01:30', timeEnd: '02:30', category: TaskCategory.CARE, status: TaskStatus.PENDING, shiftRole: 'night_blue' },
  { id: 'u2-nb4', unitId: 'u2', title: 'Diskhantering', description: 'Töm diskmaskin i pentryt.', substituteInstructions: 'Ställ tillbaka kopparna i de övre skåpen så att de är redo för frukost.', timeStart: '04:30', timeEnd: '05:30', category: TaskCategory.SERVICE, status: TaskStatus.PENDING, shiftRole: 'night_blue' },
  { id: 'u2-nb5', unitId: 'u2', title: 'Kaffebryggning', description: 'Förbered frukostkaffe.', substituteInstructions: 'Använd 2 mått kaffe per liter vatten. Brygg 3 fulla kannor.', timeStart: '06:15', timeEnd: '06:45', category: TaskCategory.SERVICE, status: TaskStatus.PENDING, shiftRole: 'night_blue' }
];
