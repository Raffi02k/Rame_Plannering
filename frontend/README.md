# Frontend – Rame Plannering

React-baserad frontend med MSAL för OIDC-autentisering och deterministisk skiftfördelning.

## 🏗️ Arkitektur

```
frontend/
├── src/
│   ├── auth/              # MSAL konfiguration
│   │   ├── msalConfig.ts  # Microsoft Entra ID setup
│   │   └── claims.ts      # Claims parsing
│   ├── context/           # React Context  
│   │   ├── AuthContext.tsx     # Auth state & token management
│   │   └── TaskContext.tsx     # Task state management
│   ├── pages/             # Vyer
│   │   ├── LoginPage.tsx
│   │   ├── admin/         # Admin-specifika komponenter
│   │   ├── staff/         # Personal-specifika komponenter
│   │   └── user/          # Brukare-specifika komponenter
│   ├── components/        # Delade komponenter
│   │   ├── RoleGate.tsx   # Role-based rendering
│   │   └── LoadingScreen.tsx
│   ├── lib/               # Utilities
│   │   ├── utils.ts       # Shift calculation logic
│   │   └── constants.ts
│   ├── api/               
│   │   └── client.ts      # API kommunikation
│   ├── App.tsx
│   └── main.tsx
└── package.json
```

## 🔐 Autentisering med MSAL

### Setup

Microsoft Authentication Library (MSAL) hanterar OIDC-inloggning mot Microsoft Entra ID.

**Konfigurera i `src/auth/msalConfig.ts`:**
```typescript
export const msalConfig = {
  auth: {
    clientId: "din-client-id",
    authority: "https://login.microsoftonline.com/din-tenant-id",
    redirectUri: "http://localhost:5173"
  }
};

export const loginRequest = {
  scopes: ["openid", "profile", "email"]
};

export const apiTokenRequest = {
  scopes: ["api://din-api-scope"]
};
```

### AuthContext Flow

`AuthContext.tsx` orchestrerar hela autentiseringsflödet:

```typescript
const { login, logout, user, isAuthenticated } = useAuth();
```

#### 1. OIDC Login
```typescript
// Användaren klickar "Logga in med Microsoft"
await login(); 

// MSAL redirectar till Microsoft
// Efter lyckad login: MSAL får token
// Frontend anropar backend: GET /oidc/me med token
// Backend validerar + skapar/hämtar user
// AuthContext sparar user state
```

#### 2. Lokal Login
```typescript
// Användaren anger username/password
await login("admin", "password123");

// Frontend anropar: POST /token
// Backend returnerar JWT
// AuthContext sparar JWT i state
```

#### 3. Token Management
AuthContext hanterar:
- ✅ Token caching
- ✅ Automatisk refresh (MSAL)
- ✅ Token expiration handling
- ✅ Concurrent request deduplication

### Hybrid Auth Requests

API-anrop använder `getToken()` som automatiskt väljer rätt token-typ:
```typescript
const getToken = async (): Promise<string | null> => {
  // OIDC path
  if (isAuthenticated && accounts.length > 0) {
    const response = await msalInstance.acquireTokenSilent(...);
    return response.accessToken;
  }
  
  // Local JWT path
  if (token) {
    return token;
  }
  
  return null;
};
```

## 🎯 Viktiga Funktioner

### Role-Based Routing

`App.tsx` definierar skyddade routes:
```typescript
<Route 
  path="/admin" 
  element={
    <ProtectedRoute allowedRoles={["Admin"]}>
      <AdminPage />
    </ProtectedRoute>
  } 
/>
```

`RoleGate` komponent hanterar villkorlig rendering:
```typescript
<RoleGate allowedRoles={["Admin", "Personal"]}>
  <SensitivContent />
</RoleGate>
```

### Skiftfördelnings-logik

**Problem som löstes:**
Tidigare kunde skiften bli olika i Admin vs. Staff-vyn eftersom listorna innehöll olika roller.

**Lösning i `lib/utils.ts`:**
```typescript
export function getShiftForDate(
  personId: string,
  date: Date,
  lang: string = 'sv',
  staffList: Person[] = []
): ShiftInfo {
  const isStaffRole = (role?: string) => 
    role === 'staff' || role === 'personal';
  
  // Filter to ONLY staff roles before calculation
  const unitStaff = staffList
    .filter(s => s.unitId === unitId && isStaffRole(s.role))
    .sort((a, b) => a.id.localeCompare(b.id));

  // Deterministic assignment based on index
  const personIndex = unitStaff.findIndex(s => s.id === personId);
  ...
}
```

**Resultat:**
- ✅ Admin och Staff ser **exakt samma skiftfördelning**
- ✅ Deterministisk algoritm baserad på sorterad personallista
- ✅ Ingen "shift jumping" mellan vyer

### Data Fetching

`AuthContext` hämtar lookup-data (units, staff, users):
```typescript
const refreshLookups = async () => {
  const token = await getToken();
  const [unitsRes, staffRes, usersRes] = await Promise.all([
    api.get('/units', token),
    api.get('/staff', token),
    api.get('/users', token)
  ]);
  
  setUnits(unitsRes.data);
  setStaff(staffRes.data);
  setUsers(usersRes.data);
};
```

Data filtreras automatiskt av backend baserat på användarens roll.

## 📊 Vyer

### Admin Page
- Enhetöversikt och bemanning
- Dagligt schema med alla personal
- Uppgiftshantering (create, complete, sign)
- Signaturkontroll för HSL-uppgifter

### Staff Page (PersonalPage)
- Personligt dagligt schema
- Timeline-vy med uppgifter
- Uppgiftssignering
- Filtrera efter kategori

### User Page (BrukarePage)
- Schemaöversikt för brukare
- Kommande aktiviteter
- (Begränsad funktionalitet)

## 🛠️ Tech Stack

| Library | Version | Syfte |
|---------|---------|-------|
| **React** | 18.x | UI Framework |
| **TypeScript** | 5.x | Type safety |
| **Vite** | 6.x | Build tool & dev server |
| **React Router** | 7.x | Client-side routing |
| **MSAL React** | 2.x | Microsoft OIDC auth |
| **Tailwind CSS** | 3.x | Utility-first CSS |
| **Lucide React** | Latest | Icon library |

## 🚀 Kom Igång

### Installation
```bash
cd frontend
npm install
```

### Konfigurera MSAL
Uppdatera `src/auth/msalConfig.ts` med dina Azure AD-värden:
```typescript
clientId: "YOUR_CLIENT_ID",
authority: "https://login.microsoftonline.com/YOUR_TENANT_ID"
```

### Starta dev server
```bash
npm run dev
```

Frontend körs på `http://localhost:5173`

### Build för produktion
```bash
npm run build
```

Output: `dist/` mapp

## 🔧 Miljövariabler

Skapa `.env` i `frontend/`-mappen (valfritt):
```env
VITE_API_URL=http://localhost:8000
```

Används i `api/client.ts`:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

## 🎨 Styling

### Tailwind CSS
Utility-first approach för konsekvent design:
```tsx
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
  <h2 className="text-xl font-semibold text-gray-900">Titel</h2>
</div>
```

### Färgteman
- **Admin**: Blå/Cyan accenter
- **Personal**: Gröna accenter
- **Brukare**: Lila accenter

## 🐛 Debugging

### Token Inspector
Aktivera debug-verktyg genom att uncomment i `App.tsx`:
```tsx
<TokenInspector />
```

Visar:
- Current token
- Decoded claims
- Expiration time
- User role

### Console Logging
Aktivera extra logging:
```typescript
// AuthContext.tsx
console.log('🔑 Token acquired:', token);
console.log('👤 User loaded:', user);
```

## 📈 Performance

### Code Splitting
React Router hanterar automatisk code splitting per route.

### Memoization
Använd `useMemo` för dyra beräkningar:
```typescript
const shiftInfo = useMemo(
  () => getShiftForDate(userId, date, 'sv', staff),
  [userId, date, staff]
);
```

## 🔒 Säkerhet

- ✅ Role-based route protection
- ✅ Token expiration handling  
- ✅ HTTPS för produktion (konfigureras i deployment)
- ✅ XSS-skydd via React's automatic escaping
- ✅ CORS hanteras av backend

## 📝 TypeScript Typer

Huvudtyper i `src/types.ts`:
```typescript
interface User {
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'unit_admin' | 'staff' | 'user';
  unitId: string;
}

interface Task {
  id: string;
  title: string;
  category: 'HSL' | 'Care' | 'Service' | 'Social' | 'Admin';
  timeStart: string;
  timeEnd: string;
  requiresSign?: boolean;
  isCompleted: boolean;
  signedBy?: string;
}

type ShiftRole = 
  | 'morning_red' | 'morning_blue' 
  | 'evening_red' | 'evening_blue'
  | 'night_red' | 'night_blue';
```

## 🧪 Testing

För att lägga till tester:
```bash
npm install -D vitest @testing-library/react
```

Exempel test:
```typescript
import { render, screen } from '@testing-library/react';
import { LoginPage } from './LoginPage';

test('renders login button', () => {
  render(<LoginPage />);
  expect(screen.getByText(/Logga in/i)).toBeInTheDocument();
});
```

## 🤝 Bidrag

Detta är ett LIA-projekt. För frågor eller bidrag, kontakta Raffi Medzad Aghlian.
