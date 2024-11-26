import { Navigate, useLocation } from "react-router-dom";
import { authService } from "../../services/auth.service";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();

  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};