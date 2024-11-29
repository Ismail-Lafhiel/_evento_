import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { useState } from "react";
import {
  CalendarIcon,
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
  HomeIcon,
  MapPinIcon,
  TicketIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";

const OrganizerLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const user = authService.getCurrentUser();
  const navigate = useNavigate();

  const isActiveLink = (path: string) => {
    return location.pathname.includes(path);
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  const navigationItems = [
    { path: "/dashboard", icon: HomeIcon, label: "Dashboard" },
    { path: "/events", icon: CalendarIcon, label: "Events" },
    { path: "/categories", icon: MapPinIcon, label: "Locations" },
    { path: "/tickets", icon: TicketIcon, label: "Tickets" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-white shadow-xl transition-all duration-300 ease-in-out flex flex-col relative`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="absolute -right-3 top-8 bg-white rounded-full p-1.5 shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
        >
          {isSidebarOpen ? (
            <ChevronDoubleLeftIcon className="w-4 h-4 text-gray-600" />
          ) : (
            <ChevronDoubleRightIcon className="w-4 h-4 text-gray-600" />
          )}
        </button>

        {/* Sidebar Header */}
        <div className="flex items-center p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            {/* <img
              src="/logo.png" // Add your logo
              alt="Logo"
              className="h-8 w-8"
            /> */}
            {isSidebarOpen && (
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                Evento
              </h2>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 pt-5 pb-4">
          <div className="px-3">
            {isSidebarOpen && (
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-4">
                Main Menu
              </h3>
            )}
            <ul className="space-y-1">
              {navigationItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={`/organizer${item.path}`}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      isActiveLink(item.path)
                        ? "bg-primary-50 text-primary-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        isActiveLink(item.path)
                          ? "text-primary-500"
                          : "text-gray-500"
                      }`}
                    />
                    {isSidebarOpen && (
                      <span className="ml-3">{item.label}</span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>

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
      <div className="flex-1 flex flex-col overflow-hidden">
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
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default OrganizerLayout;
