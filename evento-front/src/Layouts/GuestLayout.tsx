import { Outlet, Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";
import { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import {
  UserCircleIcon,
  ChevronDownIcon,
  HomeIcon,
  InformationCircleIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

const GuestLayout = () => {
  const navigate = useNavigate();
  const isAuthenticated = authService.isAuthenticated();
  const userRole = authService.getUserRole();
  const user = authService.getCurrentUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
        <nav className="px-4 lg:px-6 py-4">
          <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">E</span>
              </div>
              <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
                Evento
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:space-x-8">
              <Link
                to="/"
                className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white"
              >
                <HomeIcon className="w-5 h-5" />
                <span>Home</span>
              </Link>
              <Link
                to="/about"
                className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white"
              >
                <InformationCircleIcon className="w-5 h-5" />
                <span>About</span>
              </Link>
              <Link
                to="/contact"
                className="flex items-center space-x-1 text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-white"
              >
                <EnvelopeIcon className="w-5 h-5" />
                <span>Contact</span>
              </Link>
            </div>

            {/* Auth Buttons / User Menu */}
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-primary-600 font-medium dark:text-gray-300 dark:hover:text-white"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:ring-4 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                  >
                    Register
                  </Link>
                </>
              ) : (
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
                    <div className="relative">
                      {user?.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.fullname}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <UserCircleIcon className="w-8 h-8 text-gray-600 dark:text-gray-300" />
                      )}
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full dark:border-gray-800"></div>
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {user?.fullname}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {userRole}
                      </p>
                    </div>
                    <ChevronDownIcon className="w-5 h-5 text-gray-500" />
                  </Menu.Button>

                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-700">
                      <div className="p-2">
                        <Menu.Item>
                          {({ active }) => (
                            <Link
                              to={`/${userRole}/dashboard`}
                              className={`${
                                active ? "bg-gray-100 dark:bg-gray-600" : ""
                              } group flex w-full items-center rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-200`}
                            >
                              Dashboard
                            </Link>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              onClick={handleLogout}
                              className={`${
                                active ? "bg-gray-100 dark:bg-gray-600" : ""
                              } group flex w-full items-center rounded-lg px-3 py-2 text-sm text-red-600 dark:text-red-400`}
                            >
                              Sign out
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open menu</span>
                {isMobileMenuOpen ? (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <Transition
            show={isMobileMenuOpen}
            enter="transition-opacity duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="lg:hidden mt-4 space-y-2">
              <Link
                to="/"
                className="block px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/about"
                className="block px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block px-4 py-2 text-gray-600 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
          </Transition>
        </nav>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default GuestLayout;
