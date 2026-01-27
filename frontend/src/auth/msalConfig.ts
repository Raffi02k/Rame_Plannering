import { Configuration, LogLevel, PublicClientApplication } from "@azure/msal-browser";

// Environment variables from Vite (prefixed with VITE_)
const clientId = import.meta.env.VITE_ENTRA_CLIENT_ID;
const tenantId = import.meta.env.VITE_ENTRA_TENANT_ID;

/**
 * MSAL Configuration
 */
export const msalConfig: Configuration = {
    auth: {
        clientId: clientId,
        authority: `https://login.microsoftonline.com/${tenantId}`,
        redirectUri: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        navigateToLoginRequestUrl: false,
    },
    cache: {
        // sessionStorage is recommended for SPAs to prevent session leakage between tabs
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) return;
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            },
        },
    },
};

/**
 * Scopes we request during login
 */
export const loginRequest = {
    scopes: ["openid", "profile", "User.Read"],
    prompt: "select_account",
};

// Initialize the MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);
