import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <div className="max-w-lg w-full text-center">
        {/* 404 Text with Sports Ball Animation */}
        <div className="relative">
          <h1 className="text-9xl font-bold text-primary-600 dark:text-primary-500 opacity-25">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-bounce">
              <svg
                className="w-24 h-24 text-primary-600 dark:text-primary-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h2 className="mt-8 text-3xl font-bold text-gray-800 dark:text-white">
          Game Over!
        </h2>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Looks like this event got cancelled! The page you're looking for is
          not in our tournament bracket.
        </p>

        {/* Helpful Links */}
        <div className="mt-8 space-y-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition duration-150 ease-in-out"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Back to Homepage
          </Link>

          <div className="flex justify-center space-x-4">
            <Link
              to="/events"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 font-medium"
            >
              Browse Events
            </Link>
            <span className="text-gray-300 dark:text-gray-600">|</span>
            <Link
              to="/contact"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 font-medium"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Fun Message */}
        <p className="mt-8 text-sm text-gray-500 dark:text-gray-400">
          Don't worry, even the best athletes miss their shots sometimes! 🏃‍♂️
        </p>
      </div>
    </div>
  );
};

export default NotFound;