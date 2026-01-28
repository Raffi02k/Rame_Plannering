import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { InteractionStatus } from "@azure/msal-browser";
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { AccountInfo } from '@azure/msal-browser';
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
    isLoading: boolean;
    units: any[];
    staff: any[];
    users: any[];
    refreshLookups: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const oidcOverrides: Record<string, { role: string; roleLabel: string; unitId?: string }> = {
        "rafmed002@trollhattan.se": { role: "admin", roleLabel: "Admin", unitId: "u3" },
    };


    // MSAL (OIDC) State
    const { instance, accounts, inProgress } = useMsal();
    const isMsalLoading = inProgress !== InteractionStatus.None;

    const isMsalAuthenticated = useIsAuthenticated();
    const [msalAccount, setMsalAccount] = useState<AccountInfo | null>(null);

    // Local Auth State
    const [localToken, setLocalToken] = useState<string | null>(localStorage.getItem('local_token'));
    const [localUser, setLocalUser] = useState<any | null>(null);


    // Lookups state
    const [units, setUnits] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    const apiToken = localToken || msalAccount?.idToken || null;

    const [isLookupsLoading, setIsLookupsLoading] = useState(false);
    const [isLocalUserLoading, setIsLocalUserLoading] = useState(false);
    const isLoading = isMsalLoading || (localToken && !localUser && isLocalUserLoading) || (!!apiToken && isLookupsLoading);


    // Funktion som hämtar units/staff/users från API
    const refreshLookups = async () => {
        if (!apiToken) return;
        setIsLookupsLoading(true);
        try {
            const [units, staff, users] = await Promise.all([
                api.getUnits(apiToken),
                api.getStaff(apiToken),
                api.getUsers(apiToken),
            ]);

            setUnits(units);
            setStaff(staff);
            setUsers(users);
        } finally {
            setIsLookupsLoading(false);
        }
    };

    useEffect(() => {
        if (accounts.length === 0) {
            setMsalAccount(null);
            return;
        }

        const account = instance.getActiveAccount() || accounts[0];
        if (!instance.getActiveAccount()) {
            instance.setActiveAccount(account);
        }

        setMsalAccount(account);
    }, [instance, accounts]);

    useEffect(() => {
        if (!apiToken) {
            setUnits([]);
            setStaff([]);
            setUsers([]);
            if (localToken) {
                setLocalUser(null);
            }
            return;
        }

        // Hämta "me" om den inte redan finns (endast local auth)
        if (localToken && !localUser) {
            setIsLocalUserLoading(true);
            api.getMe(localToken)
                .then(userData => setLocalUser(userData))
                .catch(() => logout())
                .finally(() => setIsLocalUserLoading(false));
        }

        // Hämta lookups
        refreshLookups().catch(err => {
            console.error('Failed to load lookups', err);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiToken, localToken, localUser]);


    const { name, username, oid } = getUserIdentity(msalAccount);
    const primaryRole = getPrimaryRole(msalAccount);

    // Unified User Object
    const user = useMemo(() => {
        // MSAL User Priority
        if (msalAccount) {
            const oidcOverride = username ? oidcOverrides[username.toLowerCase()] : undefined;
            const role = oidcOverride?.role || primaryRole?.toLowerCase() || 'personal';
            const roleLabel = oidcOverride?.roleLabel || primaryRole || 'Personal';
            return {
                id: oid,
                name: name,
                username: username,
                role: role,
                roleLabel: roleLabel,
                unitId: oidcOverride?.unitId || 'u1',
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
    }, [msalAccount, name, username, oid, primaryRole, localUser]);

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
        if (msalAccount) {
            instance.setActiveAccount(null);
            setMsalAccount(null);
            instance.logoutRedirect({
                account: msalAccount,
            });
        }
    };

    const value: AuthContextType = {
        token: msalAccount?.idToken || localToken,
        user,
        login,
        logout,
        isAuthenticated: isMsalAuthenticated || !!msalAccount || !!localToken,
        isLocalAuth: !!localToken && !isMsalAuthenticated,
        rawClaims: msalAccount?.idTokenClaims || localUser,
        isLoading,
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
