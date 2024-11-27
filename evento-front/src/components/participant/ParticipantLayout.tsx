// src/layouts/ParticipantLayout.tsx (renamed from ParticipantDashboard.tsx)
import { Outlet, Link, useLocation } from 'react-router-dom';
import { authService } from '../../services/auth.service';


const ParticipantLayout = () => {
  const location = useLocation();
  
  return (
    <div className="flex h-screen bg-gray-100">
      <Outlet />
    </div>
  );
};

export default ParticipantLayout;
