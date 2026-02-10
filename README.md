# Rame Plannering – Schedule Management System

Ett digitalt schemasystem för kommunal vård och omsorg (LSS och SÄBO) med hybrid autentisering och intelligent skiftfördelning.

## 🎯 Översikt

Rame Plannering är ett komplett system för schemahantering som kombinerar:
- **FastAPI Backend** med SQLite-databas och hybrid autentisering (Lokal + OIDC/Microsoft Entra ID)
- **React Frontend** med MSAL-integration för enkel Single Sign-On
- **Rollbaserad åtkomst** för Admin, Personal och Brukare
- **Deterministisk skiftfördelning** som garanterar konsistens mellan olika vyer

## ✨ Huvudfunktioner

### Autentisering
- **Hybrid autentisering**: Både lokalt (användarnamn/lösenord) och OIDC (Microsoft Entra ID)
- **Concurrency-säker användarskapande**: Hanterar samtidiga inloggningar utan databaskrockar
- **Automatisk enhetstilldelning**: Nya OIDC-användare tilldelas automatiskt "Unit 3"
- **Rollbaserad säkerhet**: Admin, Enhetschef, Personal, Brukare

### Schema & Bemanning
- **Intelligent skiftfördelning**: Deterministisk algoritm baserad på enbart personalmärkning
- **Färgteam**: Röd, Blå, Lila, Vit (LSS) / Röd, Blå (SÄBO)
- **Pass**: Morgon, Kväll, Natt med specifika tider
- **Uppgiftskategorier**: Brukarnära, HSL (signering krävs), Praktisk, Administrativ

### Vyer
- **Admin**: Översikt alla enheter, full schemahantering, signeringskontroll
- **Personal**: Personligt schema, uppgiftsvy med tidslinje, signering
- **Brukare**: Schemaöversikt för egen vårdplan

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM för databashantering
- **SQLite** - Lightweight databas med WAL-mode
- **python-jose** - JWT token-hantering
- **passlib** - Password hashing (bcrypt)
- **requests** - HTTP-klient för OIDC JWKS

### Frontend
- **Vite** - Snabb build tool
- **React 18** + **TypeScript** - Komponentbibliotek med typsäkerhet
- **React Router** - Client-side routing
- **MSAL (Microsoft Authentication Library)** - OIDC/Azure AD-integration
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Ikoner

## 🚀 Kom Igång

### Förutsättningar
- **Python 3.13+**
- **Node.js 18+**
- **npm eller yarn**

### 1. Klona projektet
```bash
git clone https://github.com/Raffi02k/rame_Plannering.git
cd rame_Plannering
```

### 2. Backend Setup

#### Skapa virtuell miljö
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # På Windows: venv\\Scripts\\activate
```

#### Installera dependencies
```bash
pip install -r requirements.txt
```

#### Konfigurera miljövariabler
Skapa `.env` i `backend/`-mappen:
```env
# Local JWT
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# OIDC/Microsoft Entra ID (valfritt)
OIDC_ISSUER=https://login.microsoftonline.com/{tenant-id}/v2.0
OIDC_AUDIENCE=api://{your-api-client-id}
OIDC_JWKS_URL=https://login.microsoftonline.com/{tenant-id}/discovery/v2.0/keys
OIDC_REQUIRED_SCOPES=api://your-api-scope
```

#### Starta backend
```bash
uvicorn app.main:app --reload
```
Backend körs nu på `http://localhost:8000`

### 3. Frontend Setup

#### Installera dependencies
```bash
cd frontend
npm install
```

#### Konfigurera MSAL (valfritt för OIDC)
Uppdatera `frontend/src/auth/msalConfig.ts` med dina Azure AD-värden.

#### Starta frontend
```bash
npm run dev
```
Frontend körs nu på `http://localhost:5173`

### 4. Testa systemet

**Lokala testanvändare** (skapas automatiskt vid första start):
- **Admin**: `admin` / `password123`
- **Personal (Unit 1)**: `emma` / `password123`
- **Personal (Unit 2)**: `karim` / `password123`

## 📁 Projektstruktur

```
rame_Plannering/
├── backend/
│   ├── app/
│   │   ├── auth/          # Autentiseringslogik (local_jwt + oidc)
│   │   ├── routers/       # API endpoints
│   │   ├── models.py      # SQLAlchemy models
│   │   ├── seed.py        # Databasinitiering
│   │   └── main.py        # FastAPI app
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── auth/          # MSAL-konfiguration
    │   ├── context/       # AuthContext + TaskContext
    │   ├── pages/         # Admin, Staff, User
    │   ├── lib/           # Utilities (t.ex. shift calculation)
    │   └── App.tsx
    └── package.json
```

## 🔐 Autentisering

### Hybrid Auth-system
Systemet stöder **både** lokal autentisering och OIDC:

1. **Lokal JWT**: Användarnamn/lösenord → JWT-token
2. **OIDC (Microsoft Entra ID)**: SSO via MSAL → Microsoft token → Backend validering

### Concurrency-säker användarskapande
- Vid OIDC-inloggning försöker flera requests skapa samma användare samtidigt
- `IntegrityError` fångas och användaren hämtas istället
- Garanterar att alla requests lyckas utan krascher

## 📊 Skiftlogik

### Problem som löstes
Tidigare kunde skiften "hoppa" mellan personal i Admin vs. Staff-vyn eftersom:
- Admin-listan innehöll fler roller (admin, enhetschef, brukare)
- Personal-listan innehöll bara personal

### Lösning
`getShiftForDate()` filtrerar nu **alltid** till endast `staff`/`personal`-roller innan skiftberäkning:
```typescript
const unitStaff = staffList
    .filter(s => s.unitId === unitId && isStaffRole(s.role))
    .sort((a, b) => a.id.localeCompare(b.id));
```
Detta garanterar att både Admin och Personal ser exakt samma skiftfördelning.

## 📖 Dokumentation

- **Backend**: `backend/README.md` - API-dokumentation, databas, autentisering
- **Frontend**: `frontend/README.md` - React-komponent, MSAL, skiftlogik

## 🙏 Bidrag

Detta är ett LIA-projekt utvecklat av Raffi Medzad Aghlian.

## 📝 Licens

Privat projekt - ingen licens specificerad.
