import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { useState } from "react";
import {
  CalendarIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  HomeIcon,
  TagIcon,
  TicketIcon,
} from "@heroicons/react/16/solid";

const OrganizerLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

  // Function to check if the current path matches the link
  const isActiveLink = (path: string) => {
    return location.pathname.includes(path);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-lg transition-all duration-300 ease-in-out flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b">
          {isSidebarOpen && (
            <h2 className="text-xl font-semibold text-gray-800">
              Paticipant Panel
            </h2>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            {isSidebarOpen ? (
              <ChevronDoubleLeftIcon className="w-6 h-6 text-gray-600" />
            ) : (
              <ChevronDoubleRightIcon className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="mt-6 flex-1">
          <ul className="space-y-2">
            <li>
              <Link
                to="/organizer/dashboard"
                className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${
                  isActiveLink("/dashboard")
                    ? "bg-primary-50 text-primary-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <HomeIcon className="w-6 h-6" />
                {isSidebarOpen && <span className="ml-3">Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/organizer/events"
                className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${
                  isActiveLink("/events")
                    ? "bg-primary-50 text-primary-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <CalendarIcon className="w-6 h-6" />
                {isSidebarOpen && <span className="ml-3">Events</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/organizer/categories"
                className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${
                  isActiveLink("/categories")
                    ? "bg-primary-50 text-primary-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <TagIcon className="w-6 h-6" />
                {isSidebarOpen && <span className="ml-3">Categories</span>}
              </Link>
            </li>
            <li>
              <Link
                to="/organizer/tickets"
                className={`flex items-center px-4 py-3 text-gray-700 rounded-lg transition-colors ${
                  isActiveLink("/tickets")
                    ? "bg-primary-50 text-primary-600"
                    : "hover:bg-gray-50"
                }`}
              >
                <TicketIcon className="w-6 h-6" />
                {isSidebarOpen && <span className="ml-3">Tickets</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* User Profile Section */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary-500 flex items-center justify-center text-white">
              {user?.fullname?.charAt(0)}
            </div>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">
                  {user?.fullname}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <h1 className="text-xl font-semibold text-gray-800">
              {location.pathname
                .split("/")
                .pop()
                ?.replace(/-/g, " ")
                .replace(/\b\w/g, (char) => char.toUpperCase()) || "Dashboard"}
            </h1>
            <button
              onClick={() => {
                authService.logout();
                navigate("/login");
              }}
              className="flex items-center px-4 py-2 text-sm text-red-600 rounded-lg hover:bg-red-100"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OrganizerLayout;
