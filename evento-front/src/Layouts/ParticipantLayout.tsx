import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { useState } from "react";
import {
  HomeIcon,
  TicketIcon,
  CalendarIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  UserGroupIcon,
  StarIcon,
  BellIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";

const ParticipantLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const user = authService.getCurrentUser();

  const isActiveLink = (path: string) => {
    return location.pathname.includes(path);
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ease-in-out flex flex-col fixed h-full z-30`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
          {isSidebarOpen && (
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                Participant
              </h2>
            </div>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
          >
            {isSidebarOpen ? (
              <ChevronDoubleLeftIcon className="w-5 h-5" />
            ) : (
              <ChevronDoubleRightIcon className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                isActiveLink(link.path)
                  ? "bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
            >
              <link.icon className={`w-5 h-5 ${isSidebarOpen ? "mr-3" : ""}`} />
              {isSidebarOpen && <span>{link.name}</span>}
            </Link>
          ))}
        </nav>

        {/* User Profile Section */}
        {/* User Profile Section */}
        <div className="border-t border-gray-100 p-4">
          <div
            className={`flex items-center ${
              isSidebarOpen ? "justify-between" : "justify-center"
            }`}
          >
            <div className="flex items-center min-w-0">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white font-medium">
                  {user?.fullname?.charAt(0)}
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
              </div>
              {isSidebarOpen && (
                <div className="ml-3 min-w-0">
                  <p className="text-sm font-medium text-gray-700 truncate">
                    {user?.fullname}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user?.email}
                  </p>
                </div>
              )}
            </div>
            {isSidebarOpen && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigate("/organizer/settings")}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <Cog6ToothIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                >
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <h1 className="text-2xl font-semibold text-gray-800">
              {location.pathname
                .split("/")
                .pop()
                ?.replace(/-/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase()) || "Dashboard"}
            </h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/organizer/profile")}
                className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <UserCircleIcon className="w-5 h-5" />
                <span>Profile</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const navLinks = [
  {
    name: "Dashboard",
    path: "/participant/dashboard",
    icon: HomeIcon,
  },
  {
    name: "My Events",
    path: "/participant/events",
    icon: CalendarIcon,
  },
  {
    name: "My Tickets",
    path: "/participant/tickets",
    icon: TicketIcon,
  },
  {
    name: "Teams",
    path: "/participant/teams",
    icon: UserGroupIcon,
  },
  {
    name: "Favorites",
    path: "/participant/favorites",
    icon: StarIcon,
  },
];

export default ParticipantLayout;
