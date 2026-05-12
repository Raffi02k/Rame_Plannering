# Rame Plannering – Schedule Management System

Ett digitalt schemasystem för kommunal vård och omsorg med hybrid autentisering, schemahantering och deploymentstöd för Vercel + Supabase.

## Översikt

Rame Plannering kombinerar:

- FastAPI-backend med lokal SQLite i utveckling och PostgreSQL i produktion
- React + Vite-frontend med MSAL-integration för Microsoft Entra ID
- Rollbaserad åtkomst för admin, personal och brukare
- API-routning via `/api` för lokal utveckling och Vercel-deploy

## Tech Stack

- Backend: FastAPI, SQLAlchemy, python-jose, passlib, requests
- Frontend: React, TypeScript, Vite, React Router, Tailwind CSS, MSAL
- Deployment: Vercel + Supabase PostgreSQL

## Kom Igång

### Förutsättningar

- Python 3.13+
- Node.js 18+

### 1. Klona projektet

```bash
git clone https://github.com/Raffi02k/rame_Plannering.git
cd rame_Plannering
```

### 2. Backend

```bash
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn backend.app.main:app --reload
```

Backend körs då på `http://localhost:8000`.

Om du vill fylla databasen med demo-data:

```bash
python -m backend.app.seed
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend körs normalt på `http://localhost:5173`.

Frontend använder `/api` som standard. I lokal utveckling proxas det automatiskt till `http://localhost:8000` via `frontend/vite.config.ts`.

## Miljövariabler

### Backend

Se `backend/.env.example`.

- `DATABASE_URL`
  - Lokalt: SQLite används som standard om variabeln saknas.
  - Produktion: sätt till Supabase PostgreSQL-URI.
- `SECRET_KEY`
- `ALGORITHM`
- `ACCESS_TOKEN_EXPIRE_MINUTES`
- `OIDC_ISSUER`
- `OIDC_AUDIENCE`
- `OIDC_JWKS_URL`
- `OIDC_REQUIRED_SCOPES`

### Frontend

Se `frontend/.env.example`.

- `VITE_API_URL`
- `VITE_ENTRA_CLIENT_ID`
- `VITE_ENTRA_TENANT_ID`

## Deployment

Repo:t är nu förberett för:

- frontend via Vercel static build
- backend via Vercel Python Function i `api/index.py`
- databas via Supabase PostgreSQL genom `DATABASE_URL`

Se `DEPLOYMENT.md` för den anpassade steg-för-steg-manualen för just detta repo.
