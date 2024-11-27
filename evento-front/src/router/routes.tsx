import { RouteObject } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import { GuestGuard } from "../components/guards/GuestGuard";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import { RoleGuard } from "../components/guards/RoleGuard";
import Layout from "../components/Layout";
import NotFound from "../pages/NotFound";
import ParticipantLayout from "../components/participant/ParticipantLayout";
import OriganizerLayout from "../components/organizer/OriganizerLayout";
import Dashboard from "../pages/organizer/OrganizerDashboard";
import ParticipantDashboard from "../pages/participant/ParticipantDashboard";

// Public routes (accessible to everyone)
const publicRoutes: RouteObject[] = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: "about",
    element: <About />,
  },
];

// Guest routes (only for non-authenticated users)
const guestRoutes: RouteObject[] = [
  {
    path: "register",
    element: (
      <GuestGuard>
        <Register />
      </GuestGuard>
    ),
  },
  {
    path: "login",
    element: (
      <GuestGuard>
        <Login />
      </GuestGuard>
    ),
  },
];

// Organizer routes
const organizerRoutes: RouteObject[] = [
  {
    path: "organizer",
    element: (
      <RoleGuard allowedRoles={["organizer"]}>
        <OriganizerLayout />
      </RoleGuard>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
    ],
  },
];

// Participant routes
const participantRoutes: RouteObject[] = [
  {
    path: "participant",
    element: (
      <RoleGuard allowedRoles={["participant"]}>
        <ParticipantLayout />
      </RoleGuard>
    ),
    children: [
      {
        path: "dashboard",
        element: <ParticipantDashboard />,
      },
    ],
  },
];

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      ...publicRoutes,
      ...guestRoutes,
      ...organizerRoutes,
      ...participantRoutes,
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];
