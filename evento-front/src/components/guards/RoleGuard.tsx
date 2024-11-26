import { Navigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';

export const RoleGuard = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const userRole = authService.getUserRole();

  if (!authService.isAuthenticated() || !userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
