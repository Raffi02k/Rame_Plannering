import React, { createContext, useContext, useMemo, useState, useEffect, useRef } from 'react';
import { InteractionStatus } from "@azure/msal-browser";
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { AccountInfo } from '@azure/msal-browser';
import { apiTokenRequest, loginRequest } from '../auth/msalConfig';
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
    isLoggingIn: boolean; // Keep for backward compatibility if needed, but we'll prefer loadingLabel
    isLoggingOut: boolean;
    loadingLabel: string | null;
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
    const [msalToken, setMsalAccessToken] = useState<string | null>(null);

    // Local Auth State
    const [localToken, setLocalToken] = useState<string | null>(localStorage.getItem('local_token'));
    const [localUser, setLocalUser] = useState<any | null>(null);
    const [oidcUser, setOidcUser] = useState<any | null>(null);


    // Lookups state
    const [units, setUnits] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);

    const apiToken = localToken || msalToken || null;

    const [isLookupsLoading, setIsLookupsLoading] = useState(false);
    const [isLocalUserLoading, setIsLocalUserLoading] = useState(false);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [loadingLabel, setLoadingLabel] = useState<string | null>(null);

    const isLoading = isMsalLoading || (localToken && !localUser && isLocalUserLoading) || (!!apiToken && isLookupsLoading);


    // Funktion som hämtar units/staff/users från API
    const refreshLookups = async () => {
        if (!apiToken) return;
        setIsLookupsLoading(true);

        const loadLookups = async (token: string) => {
            const [units, staff, users] = await Promise.all([
                api.getUnits(token),
                api.getStaff(token),
                api.getUsers(token),
            ]);
            setUnits(units);
            setStaff(staff);
            setUsers(users);
        };

        try {
            await loadLookups(apiToken);
        } catch (error) {
            if (!msalAccount) {
                throw error;
            }

            try {
                const response = await instance.acquireTokenSilent({
                    ...apiTokenRequest,
                    account: msalAccount,
                });
                setMsalAccessToken(response.accessToken);
                await loadLookups(response.accessToken);
            } catch (refreshError) {
                throw refreshError;
            }
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
        if (!msalAccount) {
            setMsalAccessToken(null);
            return;
        }

        const getToken = async () => {
            try {
                const response = await instance.acquireTokenSilent({
                    ...apiTokenRequest,
                    account: msalAccount,
                });
                setMsalAccessToken(response.accessToken);
                console.log("✅ OIDC Access Token acquired silently");
            } catch (error) {
                console.error("❌ Silent token acquisition failed", error);
            }
        };
        getToken();
    }, [instance, msalAccount]);

    // 3. Handle OIDC "Landing" Splash Screen (Guaranteed 2s)
    const splashScreenTriggered = useRef(false);
    useEffect(() => {
        const isRestarting = localStorage.getItem('oidc_starting_up') === 'true';

        // If we land with an account and the flag is set, start the 2s timer
        if (isRestarting && msalAccount && !splashScreenTriggered.current) {
            console.log("🚀 OIDC Landed. Starting 2s splash screen...");
            splashScreenTriggered.current = true;
            setIsLoggingIn(true);
            setLoadingLabel("Loggar in");

            setTimeout(() => {
                console.log("🏁 OIDC Splash screen finished");
                setIsLoggingIn(false);
                setLoadingLabel(null);
                localStorage.removeItem('oidc_starting_up');
                // Reset ref for potential future logins in same session
                splashScreenTriggered.current = false;
            }, 2000);
        }
    }, [msalAccount]);

    useEffect(() => {
        if (!apiToken) {
            setUnits([]);
            setStaff([]);
            setUsers([]);
            if (localToken) {
                setLocalUser(null);
            }
            setOidcUser(null);
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

        if (msalToken && !oidcUser) {
            api.getMeOidc(msalToken)
                .then(userData => setOidcUser(userData))
                .catch(err => {
                    console.error('Failed to load OIDC profile', err);
                    setOidcUser(null);
                });
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
            if (oidcUser) {
                const avatar = oidcUser.avatar || (oidcUser.username || username || oid ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${oidcUser.username || username || oid}` : undefined);
                const normalizedRole =
                    oidcUser.role === 'staff' ? 'personal' :
                        oidcUser.role === 'user' ? 'brukare' :
                            oidcUser.role;

                const roleLabel =
                    oidcUser.role === 'staff' ? 'Personal' :
                        oidcUser.role === 'user' ? 'Brukare' :
                            oidcUser.role.charAt(0).toUpperCase() + oidcUser.role.slice(1);

                return {
                    ...oidcUser,
                    avatar,
                    role: normalizedRole,
                    roleLabel: roleLabel,
                    authMethod: 'oidc',
                };
            }
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
    }, [msalAccount, name, username, oid, primaryRole, localUser, oidcUser]);

    const login = async (username?: string, password?: string) => {
        // Option A: OIDC Login
        if (!username || !password) {
            await instance.loginRedirect(loginRequest);
            return null;
        }

        // Option B: Local Login
        try {
            console.log("Starting local login...");
            setIsLoggingIn(true);
            setLoadingLabel("Loggar in");

            const data = await api.login(username, password);
            if (!data?.access_token) {
                throw new Error('Fel användarnamn eller lösenord');
            }
            localStorage.setItem('local_token', data.access_token);
            setLocalToken(data.access_token);

            const userData = await api.getMe(data.access_token);
            setLocalUser(userData);

            console.log("Local login data fetched, waiting for timer...");
            // Force at least 2 seconds of loading
            setTimeout(() => {
                console.log("Login timer finished.");
                setIsLoggingIn(false);
                setLoadingLabel(null);
                localStorage.removeItem('postLoginAt');
            }, 2000);

            return userData;
        } catch (error) {
            console.error("Local login failed", error);
            setIsLoggingIn(false);
            setLoadingLabel(null);
            localStorage.removeItem('postLoginAt');
            throw error;
        }
    };

    const logout = () => {
        if (isLoggingOut) return;
        console.log("Logout initiated...");
        setIsLoggingOut(true);
        setLoadingLabel("Loggar ut");

        window.setTimeout(() => {
            console.log("Logout timer finished, clearing state...");
            // Clear MSAL if active
            if (msalAccount) {
                const accountToLogout = msalAccount;
                localStorage.removeItem('local_token');
                setLocalToken(null);
                setLocalUser(null);
                setUnits([]);
                setStaff([]);
                setUsers([]);
                setMsalAccount(null);
                setMsalAccessToken(null);

                console.log("Redirecting to OIDC logout...");
                instance.logoutRedirect({
                    account: accountToLogout,
                    postLogoutRedirectUri: window.location.origin,
                });
            } else {
                // Local Logout
                localStorage.removeItem('local_token');
                setLocalToken(null);
                setLocalUser(null);
                setUnits([]);
                setStaff([]);
                setUsers([]);
                setIsLoggingOut(false);
                setLoadingLabel(null);
            }
        }, 2000);
    };

    const value: AuthContextType = {
        token: apiToken,
        user,
        login,
        logout,
        isAuthenticated: isMsalAuthenticated || !!msalAccount || !!localToken,
        isLocalAuth: !!localToken && !isMsalAuthenticated,
        rawClaims: msalAccount?.idTokenClaims || localUser,
        isLoading,
        isLoggingIn,
        isLoggingOut,
        loadingLabel,
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
