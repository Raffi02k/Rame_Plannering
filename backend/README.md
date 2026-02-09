# Backend – Rame Plannering API

FastAPI-baserad backend med hybrid autentisering (Lokal JWT + OIDC) och SQLite-databas.

## 🏗️ Arkitektur

```
backend/
├── app/
│   ├── auth/               # Autentiseringsmodul
│   │   ├── __init__.py    # Hybrid auth orchestration 
│   │   ├── local_jwt.py   # JWT token-hantering
│   │   └── oidc.py        # OIDC/Microsoft Entra ID
│   ├── routers/           # API endpoints
│   │   ├── api.py         # Huvuddata (units, staff, schedule)
│   │   ├── local_auth.py  # /token endpoint
│   │   └── oidc_auth.py   # /oidc/me endpoint
│   ├── models.py          # SQLAlchemy datamodeller
│   ├── schemas.py         # Pydantic scheman
│   ├── db.py              # Databaskonfiguration
│   ├── seed.py            # Databasinitiering  
│   └── main.py            # FastAPI app
└── requirements.txt
```

## 🔐 Autentiseringssystem

### Hybrid Auth-strategi

Systemet stöder **två autentiseringsmetoder** samtidigt:

#### 1. Lokal JWT (Användarnamn/Lösenord)
```python
POST /token
Body: { "username": "admin", "password": "password123" }
Response: { "access_token": "...", "token_type": "bearer" }
```

#### 2. OIDC (Microsoft Entra ID)
Frontend använder MSAL för att få en Microsoft-token som skickas till backend:
```python
GET /oidc/me
Header: Authorization: Bearer <microsoft-token>
Response: { "id": "...", "name": "...", "role": "...", ... }
```

### Hybrid Endpoints
Vissa endpoints accepterar **både** lokal JWT och OIDC:
```python
@router.get("/units")
def get_units(current_user: models.User = Depends(get_current_user_hybrid)):
    # Fungerar med både lokal JWT och OIDC token
    ...
```

### Concurrency-säker Användarskapande

**Problem**: Vid OIDC-login skickar frontend 4 parallella requests. Alla försöker skapa samma användare samtidigt.

**Lösning**: `IntegrityError`-hantering med fallback:
```python
try:
    db_session.add(created_user)
    db_session.commit()
except IntegrityError:
    db_session.rollback()
    # Någon annan request hann skapa användaren - hämta den istället
    existing_user = db_session.query(User).filter(...).first()
    return existing_user
```

Detta garanterar att:
- ✅ Alla 4 requests lyckas
- ✅ Ingen "database is locked" error
- ✅ Användaren skapas exakt en gång

### Automatisk Enhetstilldelning

Nya OIDC-användare tilldelas automatiskt **Unit 3** ("Utvecklingsverksamheten"):
```python
unit_id=(override.get("unit_id") if override else "u3")
```

Detta kan åsidosättas via `OIDC_USER_OVERRIDES` för specifika användare.

## 📊 Databas

### Modeller

#### User
```python
class User(Base):
    id: str                 # Primary key
    username: str           # Unikt användarnamn
    email: str             # E-postadress (för OIDC-länkning)
    hashed_password: str   # Bcrypt hash
    name: str              # Visningsnamn
    role: str              # admin | unit_admin | staff | user
    auth_method: str       # local | oidc
    oidc_id: str          # Microsoft Entra Object ID
    oidc_tenant_id: str   # Tenant ID
    unit_id: str          # Foreign key -> Unit
```

#### Unit
```python
class Unit(Base):
    id: str        # u1, u2, u3
    name: str      # "SÄBO Källstorpsgården"
    type: str      # lss | sabo
```

#### TaskTemplate
```python
class TaskTemplate(Base):
    id: str
    unit_id: str
    title: str
    description: str
    substitute_instructions: str
    category: str           # HSL | Care | Service | Social | Admin
    role_type: str         # morning_red | evening_blue | etc.
    is_shared: bool
    meta_data: JSON        # { timeStart, timeEnd, requiresSign, ... }
```

#### TaskInstance
```python
class TaskInstance(Base):
    id: str
    template_id: str       # Foreign key -> TaskTemplate
    date: Date
    assignee_id: str      # Foreign key -> User
    is_completed: bool
    signed_by_id: str     # Foreign key -> User (för HSL-uppgifter)
```

### Seeding

Databasen seedas automatiskt vid första start med:
- **3 enheter**: Kronan (LSS), Källstorp (SÄBO), Utvecklingsverksamheten
- **25+ användare**: Admin, enhetschefer, personal, brukare
- **200+ uppgiftsmallar**: Kategoriserade efter enhet och pass

**Idempotens**: Seedingen körs bara om "admin"-användaren inte finns:
```python
if db_session.query(models.User).filter(models.User.id == "admin").first():
    print("Database already seeded. Skipping.")
    return
```

## 🛣️ API Endpoints

### Autentisering

| Endpoint | Method | Auth | Beskrivning |
|----------|--------|------|-------------|
| `/token` | POST | None | Login med username/password → JWT |
| `/me` | GET | Local JWT | Hämta current user (lokal) |
| `/oidc/me` | GET | OIDC | Hämta current user (OIDC) |

### Huvuddata (Hybrid Auth)

| Endpoint | Method | Auth | Beskrivning |
|----------|--------|------|-------------|
| `/units` | GET | Hybrid | Lista enheter (filtrerat på roll) |
| `/staff` | GET | Hybrid | Lista personal (filtrerat på roll) |
| `/users` | GET | Hybrid | Lista alla användare (admin only) |

### Schema

| Endpoint | Method | Auth | Beskrivning |
|----------|--------|------|-------------|
| `/schedule/day` | GET | Hybrid | Dagens schema för en enhet |
| `/tasks` | GET | Hybrid | Hämta uppgifter (filtrerat) |
| `/tasks/{id}` | PATCH | Hybrid | Uppdatera uppgift (complete/sign) |
| `/tasks` | POST | Hybrid | Skapa ny admin-uppgift |

### Rollbaserad Filtrering

- **Admin**: Ser alla enheter och all personal
- **Unit Admin**: Ser bara sina tilldelade enheter
- **Staff/User**: Ser bara sin egen enhet

## 🔧 Miljövariabler

Skapa `.env` i `backend/`-mappen:

```env
# === Local JWT ===
SECRET_KEY=din-hemliga-nyckel-här
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# === OIDC / Microsoft Entra ID (Valfritt) ===
# Issuer (kan vara kommaseparerad lista)
OIDC_ISSUER=https://login.microsoftonline.com/{tenant-id}/v2.0

# Audience (din API:s App ID URI eller Client ID)
OIDC_AUDIENCE=api://{your-api-client-id}

# JWKS endpoint för token-validering
OIDC_JWKS_URL=https://login.microsoftonline.com/{tenant-id}/discovery/v2.0/keys

# Krävda scopes (kommaseparerad)
OIDC_REQUIRED_SCOPES=api://your-api-scope

# JWKS cache TTL (default: 3600 sekunder)
OIDC_JWKS_CACHE_TTL_SECONDS=3600
```

### Hitta dina Azure AD-värden

1. **Tenant ID**: Azure Portal → Azure Active Directory → Overview
2. **Client ID**: App registrations → Din app → Application (client) ID
3. **API Scope**: Expose an API → Scopes

## 🚀 Kom Igång

### Installation
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Starta server
```bash
uvicorn app.main:app --reload
```

Backend körs på `http://localhost:8000`

### API Dokumentation
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Testa API
```bash
# Get JWT token
curl -X POST http://localhost:8000/token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "username=admin&password=password123"

# Use token
curl http://localhost:8000/units \\
  -H "Authorization: Bearer <your-token>"
```

## 🐛 Debugging

### Visa databas
```bash
sqlite3 sql_app.db
.tables
SELECT * FROM users;
```

### Check script
```bash
python -m app.check_db
```

## 📈 Prestandaoptimering

### SQLite WAL Mode
```python
# db.py
cursor.execute("PRAGMA journal_mode=WAL")
cursor.execute("PRAGMA synchronous=NORMAL")
```
Write-Ahead Logging ger bättre concurrency för läs/skriv-operationer.

### Batch Processing
Seeding använder batch commits för att minimera låsningstid:
```python
for user in users:
    db_session.merge(user)
db_session.commit()  # En commit för alla
```

## 🔒 Säkerhet

- ✅ Bcrypt password hashing
- ✅ JWT token expiration
- ✅ OIDC token signature validation
- ✅ Scope checking för OIDC
- ✅ Role-based endpoint protection
- ✅ SQL injection protection (SQLAlchemy ORM)

## 📝 Dependencies

Se `requirements.txt` för fullständig lista:
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `sqlalchemy` - ORM
- `python-jose[cryptography]` - JWT
- `passlib[bcrypt]` - Password hashing
- `python-multipart` - Form data
- `requests` - HTTP client