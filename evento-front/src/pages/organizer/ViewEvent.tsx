import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { eventService } from "../../services/event.service";
import { Event } from "../../types/types";

const ViewEvent = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        if (!id) return;
        const eventData = await eventService.getEventById(id);
        setEvent(eventData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Event Details</h1>

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">{event.name}</h2>
          <p className="text-gray-600 mb-2">{event.description}</p>
          <p className="mb-2">
            <span className="font-medium">Sport Type:</span> {event.sportType}
          </p>
          <p className="mb-2">
            <span className="font-medium">Date:</span>{" "}
            {new Date(event.date).toLocaleDateString()}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">
            Participants ({event.participants.length})
          </h3>
          <div className="bg-gray-50 rounded-lg p-4">
            {event.participants.length > 0 ? (
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">Name</th>
                    <th className="text-left py-2">Email</th>
                    <th className="text-left py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {event.participants.map((participant) => (
                    <tr key={participant._id} className="border-b">
                      <td className="py-2">{participant.fullname}</td>
                      <td className="py-2">{participant.email}</td>
                      <td className="py-2">
                        <button
                          onClick={() => {
                            if (
                              window.confirm(
                                "Are you sure you want to remove this participant?"
                              )
                            ) {
                              eventService
                                .removeParticipant(event._id, participant._id)
                                .then(() => {
                                  // Refresh event data
                                  eventService
                                    .getEventById(event._id)
                                    .then((updatedEvent) =>
                                      setEvent(updatedEvent)
                                    );
                                })
                                .catch((error) =>
                                  console.error(
                                    "Error removing participant:",
                                    error
                                  )
                                );
                            }
                          }}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500">No participants yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewEvent;
