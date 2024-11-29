import { useEffect, useState } from "react";
import { userService } from "../../services/user.service";
import { eventService } from "../../services/event.service";
import { locationService } from "../../services/location.service";
import { User, Event, Location } from "../../types/types";

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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">System Statistics</h2>
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
    </div>
  );
};

export default OrganizerDashboard;
