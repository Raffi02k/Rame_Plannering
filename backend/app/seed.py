from sqlalchemy.orm import Session
from . import models, db, auth

def seed_data():
    db_session = db.SessionLocal()

    # Check if data exists
    if db_session.query(models.Unit).first():
        print("Data already seeded.")
        return

    print("Seeding data...")

    # --- UNITS ---
    units = [
        models.Unit(id="u1", name="Daglig verksamhet Kronan", type="lss"),
        models.Unit(id="u2", name="SÄBO Källstorpsgården", type="sabo"),
        models.Unit(id="u3", name="Utvecklingsverksamheten", type="lss"),
    ]
    db_session.add_all(units)
    db_session.commit()  # commit så relationer kan referera säkert

    # Hash once
    pwd_hash = auth.get_password_hash("password123")

    # --- USERS ---
    users = [
        # Global Admin (ser alla units)
        models.User(id="admin", name="Admin User", role="admin", unit_id="u1", username="admin", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"),
        models.User(id="oidc-raffi", name="Raffi Medzad Aghlian", role="admin", unit_id="u3", username="rafmed002@trollhattan.se", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=raffi"),

        # Unit Admins (ser bara kopplade units via admin_units)
        models.User(id="ua1", name="Kronan Admin", role="unit_admin", unit_id="u1", username="kronan_admin", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=kronan_admin"),
        models.User(id="ua2", name="Källstorpsgården Admin", role="unit_admin", unit_id="u2", username="kallstorp_admin", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=kallstorp_admin"),

        # Unit 1 Staff
        models.User(id="s1", name="Emma Andersson", role="staff", unit_id="u1", username="emma", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=emma"),
        models.User(id="s2", name="Johan Berg", role="staff", unit_id="u1", username="johan", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=johan"),
        models.User(id="s3", name="Maria Carlsson", role="staff", unit_id="u1", username="maria", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=maria"),
        models.User(id="s4", name="Anders Danielsson", role="staff", unit_id="u1", username="anders", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=anders"),
        models.User(id="s10", name="Sofia Lindkvist", role="staff", unit_id="u1", username="sofia", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=sofia"),
        models.User(id="s11", name="Lukas Ek", role="staff", unit_id="u1", username="lukas", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=lukas"),
        models.User(id="s12", name="Elsa Holm", role="staff", unit_id="u1", username="elsa", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=elsa"),
        models.User(id="s13", name="Nils Sjögren", role="staff", unit_id="u1", username="nils", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=nils"),
        models.User(id="s14", name="Klara Wallin", role="staff", unit_id="u1", username="klara", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=klara"),

        # Unit 2 Staff
        models.User(id="s5", name="Karim Al-Fayed", role="staff", unit_id="u2", username="karim", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=karim"),
        models.User(id="s6", name="Lena Svensson", role="staff", unit_id="u2", username="lena", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=lena"),
        models.User(id="s7", name="Olof Palme", role="staff", unit_id="u2", username="olof", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=olof"),
        models.User(id="s15", name="Sven Bertilsson", role="staff", unit_id="u2", username="sven", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=sven"),
        models.User(id="s16", name="Birgitta Qvist", role="staff", unit_id="u2", username="birgitta", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=birgitta"),
        models.User(id="s17", name="Eva Dahl", role="staff", unit_id="u2", username="eva", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=eva"),
        models.User(id="s18", name="Lars Malm", role="staff", unit_id="u2", username="lars", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=lars"),
        models.User(id="s19", name="Monica Berg", role="staff", unit_id="u2", username="monica", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=monica"),
        models.User(id="s20", name="Per Ström", role="staff", unit_id="u2", username="per", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=per"),
        models.User(id="s21", name="Kerstin Falk", role="staff", unit_id="u2", username="kerstin", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=kerstin"),

        # Brukare (koppla till unit_id så filtrering funkar)
        models.User(id="b1", name="Brukare nr 1", role="user", unit_id="u1", username="b1", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=b1"),
        models.User(id="b2", name="Brukare nr 2", role="user", unit_id="u1", username="b2", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=b2"),
        models.User(id="b3", name="Brukare nr 3", role="user", unit_id="u2", username="b3", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=b3"),
        models.User(id="b4", name="Brukare nr 4", role="user", unit_id="u2", username="b4", hashed_password=pwd_hash, avatar="https://api.dicebear.com/7.x/avataaars/svg?seed=b4"),
    ]

    db_session.add_all(users)
    db_session.commit()

    # --- Link unit_admins to their units via association table ---
    kronan_admin = db_session.query(models.User).filter(models.User.id == "ua1").first()
    kallstorp_admin = db_session.query(models.User).filter(models.User.id == "ua2").first()
    u1 = db_session.query(models.Unit).filter(models.Unit.id == "u1").first()
    u2 = db_session.query(models.Unit).filter(models.Unit.id == "u2").first()

    # Koppla: ua1 -> u1, ua2 -> u2
    kronan_admin.admin_units.append(u1)
    kallstorp_admin.admin_units.append(u2)

    db_session.commit()

    # --- TASK TEMPLATES ---
    # Using data from frontend/lib/demo-data.ts
    
    # Assignees map:
    # Morning Red: Emma (s1)
    # Morning Blue: Johan (s2)
    # Evening Red: Maria (s3)
    # Evening Blue: Sofia (s10)
    # Night Red: Anders (s4)
    # Night Blue: Lukas (s11)
    # U2 Morning Red: Karim (s5)
    # U2 Morning Blue: Lena (s6)
    # U2 Evening Red: Olof (s7)
    # U2 Evening Blue: Sven (s15)
    # U2 Night Red: Birgitta (s16)
    # U2 Night Blue: Eva (s17)

    tasks = [
        # ===========================================================================
        # UNIT 1: KRONAN (LSS)
        # ===========================================================================

        # --- MORNING RED (U1) -> s1 ---
        models.TaskTemplate(
            id='u1-mr1', unit_id='u1', title='HSL Insats', description='Boende nr 1, hänvisning till MCSS', 
            substitute_instructions='Tagg till medicinskåp hänger på nyckeltavlan i personalrummet. Kod: 1234.', 
            category='HSL', role_type='morning_red', is_shared=False, 
            meta_data={'timeStart': '07:00', 'timeEnd': '07:30', 'requiresSign': True}
        ),
        models.TaskTemplate(
            id='u1-mr2', unit_id='u1', title='Morgonhygien', description='Boende nr 1. Dusch och påklädning.', 
            substitute_instructions='Använd alltid taklyften. Brukaren blir lugn av att man berättar vad man gör.', 
            category='Care', role_type='morning_red', is_shared=False, 
            meta_data={'timeStart': '07:30', 'timeEnd': '08:30'}
        ),
        models.TaskTemplate(
            id='u1-mr3', unit_id='u1', title='Frukoststöd', description='Duka och servera frukost för röd grupp.', 
            substitute_instructions='Specialkost: Lgh 02 ska ha laktosfri mjölk, står längst in i kylen.', 
            category='Care', role_type='morning_red', is_shared=False, 
            meta_data={'timeStart': '09:00', 'timeEnd': '10:00'}
        ),
        models.TaskTemplate(
            id='u1-mr4', unit_id='u1', title='HSL Insats', description='Boende nr 3, hänvisning till MCSS', 
            substitute_instructions='Ska tas tillsammans med ett glas juice. Juicen finns i skafferiet.', 
            category='HSL', role_type='morning_red', is_shared=False, 
            meta_data={'timeStart': '10:30', 'timeEnd': '11:00', 'requiresSign': True}
        ),
        models.TaskTemplate(
            id='u1-mr5', unit_id='u1', title='Aktivitet: Promenad', description='Utevisstelse med boende nr 1.', 
            substitute_instructions='Glöm inte att ta med brukartelefonen. Brukaren gillar att gå mot kanalen.', 
            category='Social', role_type='morning_red', is_shared=False, 
            meta_data={'timeStart': '13:30', 'timeEnd': '14:30'}
        ),
        models.TaskTemplate(
            id='u1-mr-rep', unit_id='u1', title='Morgonrapport', description='Skriv överlämning till kvällspasset.', 
            substitute_instructions='Använd mallen "Överlämning" i systemet. Var noga med att nämna ev. avvikelser.', 
            category='Admin', role_type='morning_red', is_shared=False, 
            meta_data={'timeStart': '15:30', 'timeEnd': '16:00', 'isReportTask': True, 'reportType': 'day_to_evening'}
        ),

        # --- MORNING BLUE (U1) -> s2 ---
        models.TaskTemplate(
            id='u1-mb1', unit_id='u1', title='HSL Insats', description='Boende nr 2, hänvisning till MCSS', 
            substitute_instructions='Medicinvagnen står i korridor B. Kod 2025.', 
            category='HSL', role_type='morning_blue', is_shared=False, 
            meta_data={'timeStart': '07:15', 'timeEnd': '07:45', 'requiresSign': True}
        ),
        models.TaskTemplate(
            id='u1-mb2', unit_id='u1', title='Morgonhygien', description='Boende nr 2. Personlig vård.', 
            substitute_instructions='Tandborstning är viktig, använd den mjuka borsten i skåpet.', 
            category='Care', role_type='morning_blue', is_shared=False, 
            meta_data={'timeStart': '07:45', 'timeEnd': '08:45'}
        ),
        models.TaskTemplate(
            id='u1-mb3', unit_id='u1', title='Sophantering', description='Tömma sopor i samtliga lägenheter.', 
            substitute_instructions='Nyckel till soprummet sitter på den gemensamma nyckelknippan (blå tagg).', 
            category='Service', role_type='morning_blue', is_shared=False, 
            meta_data={'timeStart': '09:00', 'timeEnd': '09:45'}
        ),
        models.TaskTemplate(
            id='u1-mb4', unit_id='u1', title='Bakning', description='Aktivitet med boende i köket.', 
            substitute_instructions='Ingredienser finns i skåp märkt "Aktivitet". Förkläden hänger bakom dörren.', 
            category='Social', role_type='morning_blue', is_shared=False, 
            meta_data={'timeStart': '10:30', 'timeEnd': '12:00'}
        ),
        models.TaskTemplate(
            id='u1-mb5', unit_id='u1', title='Dokumentation', description='Skriva i Lifecare.', 
            substitute_instructions='Logga in med ditt SITHS-kort. Se till att signera dagens anteckningar innan du går.', 
            category='Admin', role_type='morning_blue', is_shared=False, 
            meta_data={'timeStart': '14:00', 'timeEnd': '15:00'}
        ),

        # --- EVENING RED (U1) -> s3 ---
        models.TaskTemplate(
            id='u1-er1', unit_id='u1', title='Middagsstöd', description='Servering och stöd vid middag.', 
            substitute_instructions='Duka för 4 personer. Se till att alla har sina haklappar redo.', 
            category='Care', role_type='evening_red', is_shared=False, 
            meta_data={'timeStart': '16:30', 'timeEnd': '17:30'}
        ),
        models.TaskTemplate(
            id='u1-er2', unit_id='u1', title='HSL Insats', description='Boende nr 1, hänvisning till MCSS', 
            substitute_instructions='Kontrollera i MCSS att morgondosen är tagen först.', 
            category='HSL', role_type='evening_red', is_shared=False, 
            meta_data={'timeStart': '18:00', 'timeEnd': '18:30', 'requiresSign': True}
        ),
        models.TaskTemplate(
            id='u1-er3', unit_id='u1', title='Social samvaro', description='Spela spel med boende nr 3.', 
            substitute_instructions='Favoritspelet är Fia med knuff, finns i hyllan vid TV:n.', 
            category='Social', role_type='evening_red', is_shared=False, 
            meta_data={'timeStart': '19:00', 'timeEnd': '20:00'}
        ),
        models.TaskTemplate(
            id='u1-er4', unit_id='u1', title='Kvällshygien', description='Boende nr 1. Förberedelse natt.', 
            substitute_instructions='Brukaren vill ha dörren lite på glänt och nattlampan tänd.', 
            category='Care', role_type='evening_red', is_shared=False, 
            meta_data={'timeStart': '20:00', 'timeEnd': '21:00'}
        ),
        models.TaskTemplate(
            id='u1-er5', unit_id='u1', title='Diskhantering', description='Plocka in i diskmaskin.', 
            substitute_instructions='Diskmedelstabletter finns under vasken i den låsta lådan (kod 55).', 
            category='Service', role_type='evening_red', is_shared=False, 
            meta_data={'timeStart': '21:00', 'timeEnd': '21:30'}
        ),

        # --- EVENING BLUE (U1) -> s10 ---
        models.TaskTemplate(
            id='u1-eb1', unit_id='u1', title='Kvällsfika', description='Duka fram kaffe och smörgås.', 
            substitute_instructions='Brygg 6 koppar. Glöm inte det sockerfria alternativet till lgh 04.', 
            category='Care', role_type='evening_blue', is_shared=False, 
            meta_data={'timeStart': '15:30', 'timeEnd': '16:15'}
        ),
        models.TaskTemplate(
            id='u1-eb2', unit_id='u1', title='Filmkväll', description='Gemensam aktivitet i tv-rummet.', 
            substitute_instructions='Fjärrkontrollen ligger i den översta lådan i mediabänken.', 
            category='Social', role_type='evening_blue', is_shared=False, 
            meta_data={'timeStart': '18:30', 'timeEnd': '20:00'}
        ),
        models.TaskTemplate(
            id='u1-eb3', unit_id='u1', title='Kvällshygien', description='Boende nr 4.', 
            substitute_instructions='Använd den blå tvättlappen för ansiktet och den vita för kroppen.', 
            category='Care', role_type='evening_blue', is_shared=False, 
            meta_data={'timeStart': '20:15', 'timeEnd': '21:00'}
        ),
        models.TaskTemplate(
            id='u1-eb4', unit_id='u1', title='HSL Insats', description='Boende nr 2, hänvisning till MCSS', 
            substitute_instructions='Viktigt att brukaren sköljer munnen med vatten efteråt.', 
            category='HSL', role_type='evening_blue', is_shared=False, 
            meta_data={'timeStart': '21:00', 'timeEnd': '21:15', 'requiresSign': True}
        ),
        models.TaskTemplate(
            id='u1-eb5', unit_id='u1', title='Larmkontroll', description='Kontrollera att bärbara larm laddas.', 
            substitute_instructions='Laddstationen sitter i hallen. Alla gröna lampor ska lysa.', 
            category='Service', role_type='evening_blue', is_shared=False, 
            meta_data={'timeStart': '21:30', 'timeEnd': '21:45'}
        ),

        # --- NIGHT RED (U1) -> s4 ---
        models.TaskTemplate(
            id='u1-nr1', unit_id='u1', title='HSL Insats', description='Boende nr 1, hänvisning till MCSS', 
            substitute_instructions='Kontakta alltid sjuksköterska i beredskap innan du ger vb-medicin.', 
            category='HSL', role_type='night_red', is_shared=False, 
            meta_data={'timeStart': '22:00', 'timeEnd': '22:30', 'requiresSign': True}
        ),
        models.TaskTemplate(
            id='u1-nr2', unit_id='u1', title='Tillsyn Natt', description='Runda 1. Kontroll av dörrar.', 
            substitute_instructions='Ytterdörrarna i källaren glöms ofta bort, dubbelkolla dem.', 
            category='Service', role_type='night_red', is_shared=False, 
            meta_data={'timeStart': '00:00', 'timeEnd': '00:30'}
        ),
        models.TaskTemplate(
            id='u1-nr3', unit_id='u1', title='Tillsyn Natt', description='Runda 2. Extra koll lgh 05.', 
            substitute_instructions='Gå in tyst, tänd inte i taket. Använd ficklampa vid behov.', 
            category='Care', role_type='night_red', is_shared=False, 
            meta_data={'timeStart': '03:00', 'timeEnd': '03:30'}
        ),
        models.TaskTemplate(
            id='u1-nr4', unit_id='u1', title='Tvätthantering', description='Vika handdukar.', 
            substitute_instructions='Rena handdukar läggs i det stora vita skåpet i korridoren.', 
            category='Service', role_type='night_red', is_shared=False, 
            meta_data={'timeStart': '04:30', 'timeEnd': '05:30'}
        ),
        models.TaskTemplate(
            id='u1-nr5', unit_id='u1', title='Nattrapport', description='Skriv överlämning till dagpersonal.', 
            substitute_instructions='Viktigt att notera om lgh 01 varit vaken mycket under natten.', 
            category='Admin', role_type='night_red', is_shared=False, 
            meta_data={'timeStart': '06:30', 'timeEnd': '07:00', 'isReportTask': True, 'reportType': 'night_to_day'}
        ),

        # --- NIGHT BLUE (U1) -> s11 ---
        models.TaskTemplate(
            id='u1-nb1', unit_id='u1', title='HSL Insats', description='Boende nr 3, hänvisning till MCSS', 
            substitute_instructions='Kod till kylskåpet för insulin: 9988.', 
            category='HSL', role_type='night_blue', is_shared=False, 
            meta_data={'timeStart': '22:15', 'timeEnd': '22:45', 'requiresSign': True}
        ),
        models.TaskTemplate(
            id='u1-nb2', unit_id='u1', title='Tillsyn Natt', description='Runda 1. Kontrollera fönster.', 
            substitute_instructions='Fönstren i allrummet ska vara stängda och låsta efter kl 23:00.', 
            category='Service', role_type='night_blue', is_shared=False, 
            meta_data={'timeStart': '23:30', 'timeEnd': '00:00'}
        ),
        models.TaskTemplate(
            id='u1-nb3', unit_id='u1', title='Tillsyn Natt', description='Runda 2. Blöjbyte vid behov.', 
            substitute_instructions='Inkontinensskydd finns i förrådet bakom expeditionen.', 
            category='Care', role_type='night_blue', is_shared=False, 
            meta_data={'timeStart': '02:00', 'timeEnd': '03:00'}
        ),
        models.TaskTemplate(
            id='u1-nb4', unit_id='u1', title='Dokumentation', description='Skriv nattens händelser i Lifecare.', 
            substitute_instructions='Använd korta, sakliga meningar. Glöm inte att spara ofta.', 
            category='Admin', role_type='night_blue', is_shared=False, 
            meta_data={'timeStart': '04:00', 'timeEnd': '05:00'}
        ),
        models.TaskTemplate(
            id='u1-nb5', unit_id='u1', title='Frukostförberedelse', description='Duka fram tallrikar.', 
            substitute_instructions='Porslinet står i de nedre skåpen i köket. Duka för 8 personer.', 
            category='Service', role_type='night_blue', is_shared=False, 
            meta_data={'timeStart': '06:00', 'timeEnd': '06:45'}
        ),

        # ===========================================================================
        # UNIT 2: KÄLLSTORPSGÅRDEN (SÄBO)
        # ===========================================================================

        # --- MORNING RED (U2) -> s5 ---
        models.TaskTemplate(
            id='u2-mr1', unit_id='u2', title='HSL Insats', description='Boende nr 5, hänvisning till MCSS', 
            substitute_instructions='Kod till vagn: 2024. Insulinpennorna är märkta med namn.', 
            category='HSL', role_type='morning_red', is_shared=False, 
            meta_data={'timeStart': '07:00', 'timeEnd': '07:30', 'requiresSign': True, 'assigneeId': 's5'}
        ),
        models.TaskTemplate(
            id='u2-mr2', unit_id='u2', title='Personlig Hygien', description='Boende nr 5. Duschdag.', 
            substitute_instructions='Använd glidlakan vid förflyttning. Handdukar finns i linneskåpet utanför rummet.', 
            category='Care', role_type='morning_red', is_shared=False, 
            meta_data={'timeStart': '07:30', 'timeEnd': '08:30', 'assigneeId': 's5'}
        ),
        models.TaskTemplate(
            id='u2-mr3', unit_id='u2', title='Frukoststöd', description='Servering i matsalen.', 
            substitute_instructions='Många vill ha sin gröt varmare än kaffet. Fråga alltid boende om de vill ha mjölk.', 
            category='Care', role_type='morning_red', is_shared=False, 
            meta_data={'timeStart': '09:00', 'timeEnd': '10:00', 'assigneeId': 's5'}
        ),
        models.TaskTemplate(
            id='u2-mr4', unit_id='u2', title='Aktivitet: Högläsning', description='Läs tidningen för boende.', 
            substitute_instructions='Trollhättans tidning ligger på bordet vid entrén. Läs gärna lokala nyheter först.', 
            category='Social', role_type='morning_red', is_shared=False, 
            meta_data={'timeStart': '11:00', 'timeEnd': '11:45', 'assigneeId': 's5'}
        ),
        models.TaskTemplate(
            id='u2-mr5', unit_id='u2', title='HSL Insats', description='Boende nr 7, hänvisning till MCSS', 
            substitute_instructions='Manschetten finns i sjuksköterskans rum. Brukaren ska vila 10 min innan mätning.', 
            category='HSL', role_type='morning_red', is_shared=False, 
            meta_data={'timeStart': '14:00', 'timeEnd': '14:30', 'requiresSign': True, 'assigneeId': 's5'}
        ),
        models.TaskTemplate(
            id='u2-mr-rep', unit_id='u2', title='Morgonrapport', description='Överlämning till kväll.', 
            substitute_instructions='Glöm inte att nämna om sårvården på lgh 08 har blött igenom.', 
            category='Admin', role_type='morning_red', is_shared=False, 
            meta_data={'timeStart': '15:15', 'timeEnd': '15:45', 'isReportTask': True, 'reportType': 'day_to_evening', 'assigneeId': 's5'}
        ),

        # --- MORNING BLUE (U2) -> s6 ---
        models.TaskTemplate(
            id='u2-mb1', unit_id='u2', title='Varumottagning', description='Packa upp förrådsvaror.', 
            substitute_instructions='Följesedeln lämnas till enhetschefen. Tyngsta varorna längst ner i hyllan.', 
            category='Service', role_type='morning_blue', is_shared=False, 
            meta_data={'timeStart': '08:00', 'timeEnd': '09:00'}
        ),
        models.TaskTemplate(
            id='u2-mb2', unit_id='u2', title='HSL Insats', description='Boende nr 8, hänvisning till MCSS', 
            substitute_instructions='Viktigt: Droppa i vänster öga först, vänta sedan 5 minuter.', 
            category='HSL', role_type='morning_blue', is_shared=False, 
            meta_data={'timeStart': '09:15', 'timeEnd': '09:30', 'requiresSign': True}
        ),
        models.TaskTemplate(
            id='u2-mb3', unit_id='u2', title='Aktivitet: Bakning', description='Gemensam aktivitet.', 
            substitute_instructions='Kolla allergilistan i köket. Bullformar finns i den röda burken.', 
            category='Social', role_type='morning_blue', is_shared=False, 
            meta_data={'timeStart': '10:30', 'timeEnd': '12:00'}
        ),
        models.TaskTemplate(
            id='u2-mb4', unit_id='u2', title='HSL Insats', description='Boende nr 6, hänvisning till MCSS', 
            substitute_instructions='Använd sterila handskar. Materialet finns i den vita plastbacken.', 
            category='HSL', role_type='morning_blue', is_shared=False, 
            meta_data={'timeStart': '13:00', 'timeEnd': '13:45', 'requiresSign': True}
        ),
        models.TaskTemplate(
            id='u2-mb5', unit_id='u2', title='Administrativt', description='Beställa skyddsmaterial.', 
            substitute_instructions='Beställningsportalen nås via intranätet. Använd kst 8821.', 
            category='Admin', role_type='morning_blue', is_shared=False, 
            meta_data={'timeStart': '15:00', 'timeEnd': '15:30'}
        ),

        # --- EVENING RED (U2) -> s7 ---
        models.TaskTemplate(
            id='u2-er1', unit_id='u2', title='Middagsstöd', description='Servering enhet A.', 
            substitute_instructions='Värm tallrikarna i skåpet först. Se till att alla sitter bekvämt.', 
            category='Care', role_type='evening_red', is_shared=False, 
            meta_data={'timeStart': '16:30', 'timeEnd': '17:30'}
        ),
        models.TaskTemplate(
            id='u2-er2', unit_id='u2', title='HSL Insats', description='Boende nr 5, hänvisning till MCSS', 
            substitute_instructions='Ges ofta i samband med kvällsfikat. Se till att brukaren dricker ordentligt.', 
            category='HSL', role_type='evening_red', is_shared=False, 
            meta_data={'timeStart': '18:00', 'timeEnd': '18:30', 'requiresSign': True}
        ),
        models.TaskTemplate(
            id='u2-er3', unit_id='u2', title='Aktivitet: Musikstund', description='Spela skivor i allrummet.', 
            substitute_instructions='Skivspelaren har en tendens att hoppa, lägg den på en plan yta.', 
            category='Social', role_type='evening_red', is_shared=False, 
            meta_data={'timeStart': '19:00', 'timeEnd': '20:00'}
        ),
        models.TaskTemplate(
            id='u2-er4', unit_id='u2', title='Kvällshygien', description='Boende nr 6. Tvätt.', 
            substitute_instructions='Låt brukaren känna på vattnet innan du börjar tvätta.', 
            category='Care', role_type='evening_red', is_shared=False, 
            meta_data={'timeStart': '20:15', 'timeEnd': '21:00'}
        ),
        models.TaskTemplate(
            id='u2-er5', unit_id='u2', title='Säkerhetsrond', description='Lås alla ytterdörrar.', 
            substitute_instructions='Kolla även baksidan av gymmet, dörren dit kan ibland stå på glänt.', 
            category='Service', role_type='evening_red', is_shared=False, 
            meta_data={'timeStart': '21:15', 'timeEnd': '21:30'}
        ),

        # --- EVENING BLUE (U2) -> s15 ---
        models.TaskTemplate(
            id='u2-eb1', unit_id='u2', title='Kvällsfika', description='Förbered fika.', 
            substitute_instructions='Häll upp juicen i de små glasen. De som inte tål socker har egna kex.', 
            category='Care', role_type='evening_blue', is_shared=False, 
            meta_data={'timeStart': '15:45', 'timeEnd': '16:30'}
        ),
        models.TaskTemplate(
            id='u2-eb2', unit_id='u2', title='Aktivitet: Gymnastik', description='Sittgympa i dagrummet.', 
            substitute_instructions='Sätt på lite glad musik, t.ex. schlager, det uppskattas mest.', 
            category='Social', role_type='evening_blue', is_shared=False, 
            meta_data={'timeStart': '18:00', 'timeEnd': '18:45'}
        ),
        models.TaskTemplate(
            id='u2-eb3', unit_id='u2', title='HSL Insats', description='Boende nr 8, hänvisning till MCSS', 
            substitute_instructions='Ges med lite mosad banan för lättare sväljning.', 
            category='HSL', role_type='evening_blue', is_shared=False, 
            meta_data={'timeStart': '19:30', 'timeEnd': '20:00', 'requiresSign': True}
        ),
        models.TaskTemplate(
            id='u2-eb4', unit_id='u2', title='Kvällshygien', description='Boende nr 7.', 
            substitute_instructions='Var extra försiktig runt det vänstra benet pga nyligen genomförd operation.', 
            category='Care', role_type='evening_blue', is_shared=False, 
            meta_data={'timeStart': '20:30', 'timeEnd': '21:15'}
        ),
        models.TaskTemplate(
            id='u2-eb5', unit_id='u2', title='Förrådspåfyllning', description='Fylla på handskar/förkläden.', 
            substitute_instructions='Skyddsmaterialet finns i det stora förrådet i källaren. Kod: 4433.', 
            category='Service', role_type='evening_blue', is_shared=False, 
            meta_data={'timeStart': '21:30', 'timeEnd': '22:00'}
        ),

        # --- NIGHT RED (U2) -> s16 ---
        models.TaskTemplate(
            id='u2-nr1', unit_id='u2', title='HSL Insats', description='Boende nr 5, hänvisning till MCSS', 
            substitute_instructions='Kontrollera i MCSS om det finns några sena ordinationer från kvällen.', 
            category='HSL', role_type='night_red', is_shared=False, 
            meta_data={'timeStart': '22:00', 'timeEnd': '22:30', 'requiresSign': True}
        ),
        models.TaskTemplate(
            id='u2-nr2', unit_id='u2', title='Tillsyn Natt', description='Runda 1. Kontrollera andning lgh 12.', 
            substitute_instructions='Gå in väldigt tyst, brukaren är mycket lättväckt.', 
            category='Care', role_type='night_red', is_shared=False, 
            meta_data={'timeStart': '23:30', 'timeEnd': '00:30'}
        ),
        models.TaskTemplate(
            id='u2-nr3', unit_id='u2', title='Tillsyn Natt', description='Runda 2. Blöjkontroll vid behov.', 
            substitute_instructions='Använd blöjvagnen som står i korridoren.', 
            category='Care', role_type='night_red', is_shared=False, 
            meta_data={'timeStart': '03:00', 'timeEnd': '04:00'}
        ),
        models.TaskTemplate(
            id='u2-nr4', unit_id='u2', title='Sophantering', description='Tömma inkontinensavfall.', 
            substitute_instructions='Påsarna ska knytas ordentligt och slängas i den stora bruna containern.', 
            category='Service', role_type='night_red', is_shared=False, 
            meta_data={'timeStart': '05:00', 'timeEnd': '05:45'}
        ),
        models.TaskTemplate(
            id='u2-nr5', unit_id='u2', title='Nattrapport', description='Överlämning till dag.', 
            substitute_instructions='Var extra noga med att nämna nattens larmhändelser.', 
            category='Admin', role_type='night_red', is_shared=False, 
            meta_data={'timeStart': '06:30', 'timeEnd': '07:00', 'isReportTask': True, 'reportType': 'night_to_day'}
        ),

        # --- NIGHT BLUE (U2) -> s17 ---
        models.TaskTemplate(
            id='u2-nb1', unit_id='u2', title='HSL Insats', description='Boende nr 7, hänvisning till MCSS', 
            substitute_instructions='Ge endast vb vid stark oro eller smärta. Kontakta sskt vid tvekan.', 
            category='HSL', role_type='night_blue', is_shared=False, 
            meta_data={'timeStart': '22:30', 'timeEnd': '23:00', 'requiresSign': True}
        ),
        models.TaskTemplate(
            id='u2-nb2', unit_id='u2', title='Säkerhetscheck', description='Kontroll av utrymningsvägar.', 
            substitute_instructions='Se till att inga rullstolar eller vagnar blockerar dörrarna.', 
            category='Service', role_type='night_blue', is_shared=False, 
            meta_data={'timeStart': '00:00', 'timeEnd': '00:30'}
        ),
        models.TaskTemplate(
            id='u2-nb3', unit_id='u2', title='Tillsyn Natt', description='Runda 1. Kontrollera larmknappar.', 
            substitute_instructions='Larmknapparna ska sitta fast på sängstolpen, inte ligga på golvet.', 
            category='Care', role_type='night_blue', is_shared=False, 
            meta_data={'timeStart': '01:30', 'timeEnd': '02:30'}
        ),
        models.TaskTemplate(
            id='u2-nb4', unit_id='u2', title='Diskhantering', description='Töm diskmaskin i pentryt.', 
            substitute_instructions='Ställ tillbaka kopparna i de övre skåpen så att de är redo för frukost.', 
            category='Service', role_type='night_blue', is_shared=False, 
            meta_data={'timeStart': '04:30', 'timeEnd': '05:30'}
        ),
        models.TaskTemplate(
            id='u2-nb5', unit_id='u2', title='Kaffebryggning', description='Förbered frukostkaffe.', 
            substitute_instructions='Använd 2 mått kaffe per liter vatten. Brygg 3 fulla kannor.', 
            category='Service', role_type='night_blue', is_shared=False, 
            meta_data={'timeStart': '06:15', 'timeEnd': '06:45'}
        ),

        # ===========================================================================
        # UNIT 3: UTVECKLINGSVERKSAMHETEN
        # ===========================================================================

        models.TaskTemplate(
            id='u3-dev-a', unit_id='u3', title='Kodgranskning', description='Granska pull requests och ge feedback.',
            substitute_instructions='Fokusera på säkerhet och läsbarhet.',
            category='Admin', role_type='dev_alpha', is_shared=False,
            meta_data={'timeStart': '08:15', 'timeEnd': '10:00'}
        ),
        models.TaskTemplate(
            id='u3-dev-b', unit_id='u3', title='Sprintplanering', description='Planera nästa sprint och prioritera backlog.',
            substitute_instructions='Uppdatera Jira och markera uppskattningar.',
            category='Admin', role_type='dev_beta', is_shared=False,
            meta_data={'timeStart': '10:15', 'timeEnd': '12:00'}
        ),
        models.TaskTemplate(
            id='u3-dev-c', unit_id='u3', title='Teknisk felsökning', description='Felsök inrapporterade buggar i utvecklingsmiljö.',
            substitute_instructions='Dokumentera rotorsak i loggboken.',
            category='Service', role_type='dev_gamma', is_shared=False,
            meta_data={'timeStart': '13:00', 'timeEnd': '14:30'}
        ),
        models.TaskTemplate(
            id='u3-dev-d', unit_id='u3', title='Teams-möte', description='Daglig avstämning i Teams.',
            substitute_instructions='Skriv kort status i chatten efter mötet.',
            category='Social', role_type='dev_delta', is_shared=False,
            meta_data={'timeStart': '15:00', 'timeEnd': '16:30'}
        ),
    ]
    db_session.add_all(tasks)

    db_session.commit()
    print("Data seeded successfully!")
    db_session.close()

if __name__ == "__main__":
    # Initialize DB
    models.Base.metadata.create_all(bind=db.engine)
    seed_data()
