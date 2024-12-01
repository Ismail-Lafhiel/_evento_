import { Navigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

export const RoleGuard = ({ 
  children, 
  allowedRoles 
}: { 
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const userRole = authService.getUserRole();
  
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
