import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store';
import type { Role } from '../../types';

interface AuthGuardProps {
    children: React.ReactNode;
    allowedRoles?: Role[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
    const { isAuthenticated, user } = useAuthStore();
    const location = useLocation();

    if (!isAuthenticated || !user) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // If the user doesn't have the required role, redirect to their respective dashboard
        return <Navigate to={`/${user.role}`} replace />;
    }

    return <>{children}</>;
}
