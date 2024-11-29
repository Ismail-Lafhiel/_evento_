import { RouteObject } from "react-router-dom";
import Home from "../pages/Home";
import About from "../pages/About";
import Register from "../pages/auth/Register";
import Login from "../pages/auth/Login";
import NotFound from "../pages/NotFound";
import ParticipantLayout from "../Layouts/ParticipantLayout";
import OriganizerLayout from "../Layouts/OrganizerLayout";
import GuestLayout from "../Layouts/GuestLayout";
import Dashboard from "../pages/organizer/OrganizerDashboard";
import ParticipantDashboard from "../pages/participant/ParticipantDashboard";
import EventsTable from "../pages/organizer/EventsTable";
import { GuestGuard } from "../guards/GuestGuard";
import { RoleGuard } from "../guards/RoleGuard";
import ViewEvent from "../pages/organizer/ViewEvent";

const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <GuestLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      // Guest routes (only for non-authenticated users)
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
    ],
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
      {
        path: "events",
        element: <EventsTable />,
      },
      {
        path: "events/:id",
        element: <ViewEvent />,
      }
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

// Main routes configuration
export const routes: RouteObject[] = [
  ...publicRoutes,
  ...organizerRoutes,
  ...participantRoutes,
  {
    path: "*",
    element: <GuestLayout />,
    children: [
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];
