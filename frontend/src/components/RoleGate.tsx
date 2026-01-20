import React from "react";
import { useAuth } from "../context/AuthContext";
import { AppRole } from "../auth/claims";

interface RoleGateProps {
    allowedRoles: AppRole[];
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * RoleGate renders children only if the user's role belongs to allowedRoles.
 * Now supports both MSAL/OIDC and Local authentication via AuthContext.
 */
export const RoleGate: React.FC<RoleGateProps> = ({
    allowedRoles,
    children,
    fallback = null
}) => {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated || !user) {
        return <>{fallback}</>;
    }

    // AuthContext unified the role names, but we ensure comparison is robust
    // Local roles might be 'staff', 'admin', 'user'
    // AppRole (from claims.ts) uses 'Admin', 'Personal', 'Brukare'

    const userRole = user.roleLabel || user.role;
    const isAllowed = allowedRoles.some(role =>
        role.toLowerCase() === user.role.toLowerCase() ||
        role.toLowerCase() === userRole.toLowerCase()
    );

    if (isAllowed) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};
