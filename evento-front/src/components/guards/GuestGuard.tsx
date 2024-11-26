import { Navigate } from "react-router-dom";
import { authService } from "../../services/auth.service";

export const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  if (authService.isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};