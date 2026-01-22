import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '../auth/msalConfig';
import { getPrimaryRole, getUserIdentity } from '../auth/claims';
import { api } from '../api/client';

interface AuthContextType {
    token: string | null;
    user: any | null;
    login: (username?: string, password?: string) => Promise<any | null>;
    logout: () => void;
    isAuthenticated: boolean;
    isLocalAuth: boolean;
    rawClaims: any | null;
    units: any[];
    staff: any[];
    users: any[];
    refreshLookups: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // MSAL (OIDC) State
    const { instance, accounts } = useMsal();
    const isMsalAuthenticated = useIsAuthenticated();
    const activeAccount = accounts[0] || null;

    // Local Auth State
    const [localToken, setLocalToken] = useState<string | null>(localStorage.getItem('local_token'));
    const [localUser, setLocalUser] = useState<any | null>(null);

    // Lookups state
    const [units, setUnits] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    // Funktion som hämtar units/staff/users från API
    const refreshLookups = async () => {
        // Endpointsen kräver token som backend accepterar (din /token)
        if (!localToken) return;
        const [units, staff, users] = await Promise.all([
            api.getUnits(localToken),
            api.getStaff(localToken),
            api.getUsers(localToken),
        ]);

        setUnits(units);
        setStaff(staff);
        setUsers(users);
    }

    useEffect(() => {
        if (!localToken) {
            setUnits([]);
            setStaff([]);
            setUsers([]);
            setLocalUser(null);
            return;
        }

        // Hämta "me" om den inte redan finns
        if (!localUser) {
            api.getMe(localToken)
                .then(userData => setLocalUser(userData))
                .catch(() => logout());
        }

        // Hämta lookups
        refreshLookups().catch(err => {
            console.error('Failed to load lookups', err);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [localToken]);


    const { name, username, oid } = getUserIdentity(activeAccount);
    const primaryRole = getPrimaryRole(activeAccount);

    // Unified User Object
    const user = useMemo(() => {
        // MSAL User Priority
        if (activeAccount) {
            return {
                id: oid,
                name: name,
                username: username,
                role: primaryRole?.toLowerCase() || 'personal',
                roleLabel: primaryRole || 'Personal',
                unitId: 'u1',
                authMethod: 'oidc'
            };
        }
        // Local User Fallback
        if (localUser) {
            // Map backend roles to frontend normalized roles
            const normalizedRole =
                localUser.role === 'staff' ? 'personal' :
                    localUser.role === 'user' ? 'brukare' :
                        localUser.role;

            const roleLabel =
                localUser.role === 'staff' ? 'Personal' :
                    localUser.role === 'user' ? 'Brukare' :
                        localUser.role.charAt(0).toUpperCase() + localUser.role.slice(1);

            return {
                ...localUser,
                role: normalizedRole,
                roleLabel: roleLabel,
                authMethod: 'local'
            };
        }
        return null;
    }, [activeAccount, name, username, oid, primaryRole, localUser]);

    const login = async (username?: string, password?: string) => {
        // Option A: OIDC Login
        if (!username || !password) {
            await instance.loginRedirect(loginRequest);
            return null;
        }

        // Option B: Local Login
        try {
            const data = await api.login(username, password);
            localStorage.setItem('local_token', data.access_token);
            setLocalToken(data.access_token);

            const userData = await api.getMe(data.access_token);
            setLocalUser(userData);

            return userData;
        } catch (error) {
            console.error("Local login failed", error);
            throw error;
        }
    };

    const logout = () => {
        // Clear Local
        localStorage.removeItem('local_token');
        setLocalToken(null);
        setLocalUser(null);

        // Clear lookups
        setUnits([]);
        setStaff([]);
        setUsers([]);

        // Clear MSAL if active
        if (accounts.length > 0) {
            instance.logoutRedirect();
        }
    };

    const value: AuthContextType = {
        token: activeAccount?.idToken || localToken,
        user,
        login,
        logout,
        isAuthenticated: isMsalAuthenticated || !!localToken,
        isLocalAuth: !!localToken && !isMsalAuthenticated,
        rawClaims: activeAccount?.idTokenClaims || localUser,

        units,
        staff,
        users,
        refreshLookups,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
