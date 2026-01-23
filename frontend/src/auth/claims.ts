import { AccountInfo } from "@azure/msal-browser";
/**
 * Application roles defined in Entra ID
 */
export type AppRole = "Admin" | "Personal" | "Brukare";

/**
 * Expected structure for ID Token Claims including App Roles
 */
export interface IdTokenClaims {
    name?: string;
    preferred_username?: string;
    email?: string;
    oid?: string; // Object ID (unique user id)
    tid?: string; // Tenant ID
    roles?: string[]; // App roles from Entra
}

/**
 * Extract prioritized primary role from account claims
 */
export const getPrimaryRole = (account: AccountInfo | null): AppRole | null => {
    if (!account?.idTokenClaims) return null;

    const claims = account.idTokenClaims as IdTokenClaims;
    const roles = claims.roles || [];
    const username = (claims.preferred_username || claims.email || account.username || "").toLowerCase();
    const adminFallbackEmails = [
        "rafmed002@trollhattan.se",
        "raffi.medzad.aghlian1@trollhattan.se",
    ];

    // Priority: Admin > Personal > Brukare
    if (roles.includes("Admin")) return "Admin";
    if (roles.includes("Personal")) return "Personal";
    if (roles.includes("Brukare")) return "Brukare";

    if (adminFallbackEmails.includes(username)) return "Admin";

    return null;
};

/**
 * Get display name/email from account fallback logic
 */
export const getUserIdentity = (account: AccountInfo | null) => {
    if (!account) return { name: "Gäst", username: "" };

    const claims = account.idTokenClaims as IdTokenClaims;

    return {
        name: claims.name || account.name || "Namn saknas",
        username: claims.preferred_username || claims.email || account.username || "Ingen e-post found",
        oid: claims.oid,
        tid: claims.tid,
    };
};
