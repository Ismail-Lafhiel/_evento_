import { useEffect, useState } from "react";
import { userService } from "../../services/user.service";
import { eventService } from "../../services/event.service";
import { locationService } from "../../services/location.service";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

interface DashboardStats {
  participants: { count: number };
  events: { count: number };
  locations: { count: number };
}

const OrganizerDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    participants: { count: 0 },
    events: { count: 0 },
    locations: { count: 0 },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Chart data
  const chartData = {
    labels: ["Participants", "Events", "Locations"],
    datasets: [
      {
        data: [
          stats.participants.count,
          stats.events.count,
          stats.locations.count,
        ],
        backgroundColor: [
          "rgba(59, 130, 246, 0.5)", // blue
          "rgba(34, 197, 94, 0.5)", // green
          "rgba(147, 51, 234, 0.5)", // purple
        ],
        borderColor: [
          "rgba(59, 130, 246, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(147, 51, 234, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Distribution of Resources",
      },
    },
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [participantsData, eventsData, locationsData] = await Promise.all(
          [
            userService.getAllParticipants(),
            eventService.getAllEvents(),
            locationService.getAllLocations(),
          ]
        );

        setStats({
          participants: { count: participantsData.count },
          events: { count: eventsData.count },
          locations: { count: locationsData.count },
        });
      } catch (error) {
        console.error("Error fetching statistics:", error);
        setError(
          error instanceof Error ? error.message : "Failed to fetch statistics"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-6">
      {/* Stats Cards */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-6">Evento Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Participants Stats */}
          <div className="bg-blue-50 p-6 rounded-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-200 bg-opacity-50">
                <svg
                  className="h-8 w-8 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-blue-600 font-medium">
                  Total Participants
                </p>
                <p className="text-2xl font-bold text-blue-800">
                  {stats.participants.count}
                </p>
              </div>
            </div>
          </div>

          {/* Events Stats */}
          <div className="bg-green-50 p-6 rounded-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-200 bg-opacity-50">
                <svg
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-green-600 font-medium">
                  Total Events
                </p>
                <p className="text-2xl font-bold text-green-800">
                  {stats.events.count}
                </p>
              </div>
            </div>
          </div>

          {/* Locations Stats */}
          <div className="bg-purple-50 p-6 rounded-lg">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-200 bg-opacity-50">
                <svg
                  className="h-8 w-8 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm text-purple-600 font-medium">
                  Total Locations
                </p>
                <p className="text-2xl font-bold text-purple-800">
                  {stats.locations.count}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Doughnut Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">Resource Distribution</h3>
          <div className="w-full h-[300px] flex items-center justify-center">
            <Doughnut data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-6">Statistics Overview</h3>
          <div className="space-y-6">
            {/* Participants per Event */}
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-200 rounded-lg mr-3">
                    <svg
                      className="w-5 h-5 text-blue-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-blue-600 font-medium">
                      Participants per Event
                    </p>
                    <p className="text-xs text-blue-500">
                      Average attendance per event
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-800">
                    {stats.events.count
                      ? (stats.participants.count / stats.events.count).toFixed(
                          1
                        )
                      : 0}
                  </p>
                  <p className="text-xs text-blue-600">participants/event</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-blue-600">
                Total: {stats.participants.count} participants across{" "}
                {stats.events.count} events
              </div>
            </div>

            {/* Events per Location */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-200 rounded-lg mr-3">
                    <svg
                      className="w-5 h-5 text-purple-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-purple-600 font-medium">
                      Events per Location
                    </p>
                    <p className="text-xs text-purple-500">
                      Average events hosted per venue
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-purple-800">
                    {stats.locations.count
                      ? (stats.events.count / stats.locations.count).toFixed(1)
                      : 0}
                  </p>
                  <p className="text-xs text-purple-600">events/location</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-purple-600">
                Total: {stats.events.count} events across{" "}
                {stats.locations.count} locations
              </div>
            </div>

            {/* Venue Utilization */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="p-2 bg-green-200 rounded-lg mr-3">
                    <svg
                      className="w-5 h-5 text-green-700"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-green-600 font-medium">
                      Venue Utilization
                    </p>
                    <p className="text-xs text-green-500">
                      Events to Locations ratio
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-800">
                    {stats.locations.count
                      ? (
                          (stats.events.count / stats.locations.count) *
                          100
                        ).toFixed(1)
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-green-600">utilization rate</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600">
                Average of{" "}
                {(stats.events.count / stats.locations.count).toFixed(1)} events
                per location
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrganizerDashboard;
