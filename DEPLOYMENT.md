# Deployment-manual: Rame Planner på Vercel + Supabase

Den här manualen är anpassad till hur repot faktiskt är uppbyggt nu.

## Projektstruktur

```txt
frontend/         React + Vite
backend/app/      FastAPI + SQLAlchemy
api/index.py      Vercel entrypoint för backend
vercel.json       Routing mellan frontend och backend
```

Deploy-upplägget är:

```txt
Frontend -> Vercel static build
Backend/API -> Vercel Python Function
Databas -> Supabase PostgreSQL
```

## Vad som redan är förberett i repot

- `backend/app/db.py` växlar mellan lokal SQLite och `DATABASE_URL`
- SQLite-specifika `connect_args` används bara för SQLite
- `backend/app/main.py` exponerar backend både på vanliga routes och under `/api`
- `frontend/src/api/client.ts` använder `/api` som standard
- `frontend/vite.config.ts` proxar `/api` till lokal backend i dev
- `vercel.json` routar `/api/...` till FastAPI och allt annat till frontend
- `api/index.py` exponerar FastAPI-appen för Vercel
- `requirements.txt` i repo-roten finns för Vercel Python-build

## 1. Testa lokalt först

### Backend

Från repo-roten:

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn backend.app.main:app --reload
```

Backend startar då på `http://localhost:8000`.

### Seed demo-data

Om databasen är tom:

```bash
python -m backend.app.seed
```

Det lägger in enheter, användare och uppgifter i lokal SQLite.

### Frontend

I ett nytt terminalfönster:

```bash
cd frontend
npm install
npm run dev
```

Frontend startar normalt på `http://localhost:5173` och anropar backend via `/api`.

## 2. Hur auth fungerar i det här repot

Det här repot har idag:

- lokal login via `POST /api/token`
- Microsoft Entra ID / OIDC via frontend och tokenvalidering i backend

Det finns just nu ingen `register`-route i backend. Manualer eller teststeg som nämner `/register` gäller därför inte detta repo utan extra implementation.

För lokal inloggning efter seed kan du använda till exempel:

```txt
username: admin
password: password123
```

## 3. Skapa Supabase-projekt

I Supabase:

1. Skapa ett nytt projekt.
2. Gå till `Connect`.
3. Välj `Direct`.
4. Välj `Transaction pooler`.
5. Välj `URI`.
6. Kopiera connection string.

Exempel:

```txt
postgresql://postgres.PROJECT_ID:[YOUR-PASSWORD]@aws-1-eu-west-2.pooler.supabase.com:6543/postgres
```

Byt ut `[YOUR-PASSWORD]` mot ditt riktiga databaslösenord.

## 4. Lägg in Environment Variables i Vercel

I Vercel för projektet, lägg in följande.

### Obligatoriskt

```txt
DATABASE_URL=<din Supabase connection string>
SECRET_KEY=<en lång slumpad hemlig nyckel>
```

### Valfritt

```txt
ACCESS_TOKEN_EXPIRE_MINUTES=3000
```

### Om Microsoft-inloggning ska fungera i frontend

```txt
VITE_ENTRA_CLIENT_ID=<client id>
VITE_ENTRA_TENANT_ID=<tenant id>
```

`VITE_API_URL` behöver normalt inte sättas i Vercel för detta repo, eftersom frontend och backend ligger i samma projekt och `/api` redan används som standard.

Efter ändrade environment variables: gör alltid en ny deploy eller `Redeploy`.

## 5. Vercel-konfiguration i detta repo

`vercel.json` är satt för att göra detta:

```txt
/api/... -> api/index.py -> FastAPI
allt annat -> frontend/index.html
```

Det betyder att frontend kan anropa:

```txt
/api/token
/api/me
/api/units
/api/staff
/api/users
/api/schedule/day
/api/task-instances/:id
/api/tasks
```

## 6. Databasbeteende i detta repo

`backend/app/db.py` fungerar nu så här:

- om `DATABASE_URL` saknas används lokal SQLite
- om `DATABASE_URL` finns används den direkt, t.ex. Supabase PostgreSQL

SQLite använder:

```python
connect_args={"check_same_thread": False, "timeout": 30}
```

PostgreSQL använder inte de inställningarna.

Det förhindrar felet:

```txt
invalid connection option "check_same_thread"
```

## 7. Python-beroenden för produktion

Det här repot kräver nu bland annat:

```txt
fastapi
uvicorn
sqlalchemy
python-jose[cryptography]
passlib[bcrypt]
python-multipart
psycopg2-binary
python-dotenv
```

Viktigt för Supabase/PostgreSQL:

```txt
psycopg2-binary
```

## 8. Så deployar du detta repo

1. Pusha repot till GitHub.
2. Importera repot i Vercel.
3. Låt Vercel använda repo-roten som project root.
4. Lägg in environment variables enligt ovan.
5. Deploya.
6. Öppna sidan och testa login.
7. Kontrollera sedan att API-anrop under `/api/...` fungerar.

## 9. Rekommenderad test efter deploy

Testa minst detta:

1. Ladda login-sidan.
2. Logga in lokalt med ett seedat konto eller via Microsoft.
3. Kontrollera att `GET /api/me` fungerar indirekt via appen.
4. Kontrollera att units, staff och users laddas.
5. Öppna en dagsvy så att `GET /api/schedule/day` används.
6. Uppdatera en uppgift så att `PATCH /api/task-instances/{id}` används.

## 10. Vanliga fel i just detta repo

### `ModuleNotFoundError: No module named 'psycopg2'`

Lösning:

```txt
Kontrollera att psycopg2-binary finns i requirements.txt
```

### `invalid connection option "check_same_thread"`

Lösning:

```txt
SQLite-inställningar används felaktigt mot PostgreSQL.
I detta repo är det redan uppdelat i backend/app/db.py.
```

### `password authentication failed for user "postgres"`

Lösning:

```txt
Fel lösenord i DATABASE_URL.
```

### `404` på `/api/...`

Lösning:

```txt
Kontrollera att deploymenten använder repo-versionen med vercel.json och api/index.py.
Kontrollera också att requesten verkligen går till samma Vercel-projekt.
```

### `FUNCTION_INVOCATION_FAILED`

Lösning:

```txt
Öppna Vercel Logs och läs sista raden i tracebacken.
```

## 11. Checklista före varje deploy

```txt
[ ] Backend startar lokalt
[ ] Frontend startar lokalt
[ ] Demo-data är seedad om du behöver lokala testkonton
[ ] requirements.txt i repo-roten finns kvar
[ ] backend/requirements.txt innehåller psycopg2-binary
[ ] DATABASE_URL finns i Vercel
[ ] SECRET_KEY finns i Vercel
[ ] Supabase-lösenordet i DATABASE_URL är korrekt
[ ] Vercel har redeployats efter env-ändringar
[ ] Login och dataladdning fungerar efter deploy
```

## 12. Viktigaste regeln vid fel

```txt
Network-tabben visar att något gick fel.
Vercel Logs visar varför det gick fel.
```

Så felsök alltid i denna ordning:

1. Webbläsarens Network-tab
2. Vercel request logs
3. Sista raden i tracebacken
