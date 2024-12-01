import { Navigate } from "react-router-dom";
import { authService } from "../services/auth.service";

export const GuestGuard = ({ children }: { children: React.ReactNode }) => {
  if (authService.isAuthenticated()) {
    const user = authService.getCurrentUser();
    // Redirect to appropriate dashboard based on role
    if (user?.role === 'organizer') {
      return <Navigate to="/organizer" replace />;
    }
    if (user?.role === 'participant') {
      return <Navigate to="/participant" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
