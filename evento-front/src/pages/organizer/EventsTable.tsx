import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  eventFormSchema,
  EventFormData,
} from "../../validation/EventFormSchema";
import FormInput from "../../components/form/FormInput";
import LocationSelect from "../../components/form/LocationSelect ";
import { useEffect, useState } from "react";
import { locationService } from "../../services/location.service";
import { eventService } from "../../services/event.service";
import { toast } from "react-toastify";
import CustomModal from "../../components/CustomModal";
import { Link } from "react-router-dom";
import { userService } from "../../services/user.service";
import { User } from "../../types/types";
import Select from "react-select";

interface ParticipantOption {
  value: string;
  label: string;
}

interface EventOption {
  value: string;
  label: string;
}

const EventsTable = () => {
  // events states
  //   map events
  const [events, setEvents] = useState<Event[]>([]);
  //   create
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  //   edit
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  //   delete
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  //   location states
  const [locationsList, setLocationsList] = useState<Location[]>([]);
  const [locationsMap, setLocationsMap] = useState<{ [key: string]: Location }>(
    {}
  );
  //   participants states
  const [participantsList, setParticipantsList] = useState<User[]>([]);
  const [participantsMap, setParticipantsMap] = useState<{
    [key: string]: User;
  }>({});
  const [selectedParticipants, setSelectedParticipants] = useState<
    ParticipantOption[]
  >([]);
  const [isAddingParticipants, setIsAddingParticipants] = useState(false);
  //   form states
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAddParticipantModalOpen, setIsAddParticipantModalOpen] =
    useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventFormSchema),
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all data in parallel using Promise.all
        const [fetchedEvents, fetchedLocations, fetchedParticipants] =
          await Promise.all([
            eventService.getAllEvents(),
            locationService.getAllLocations(),
            userService.getAllParticipants(),
          ]);

        // Set events (with check)
        setEvents(fetchedEvents || []);

        // Set locations (with checks)
        setLocationsList(fetchedLocations || []);
        const locationMap = (fetchedLocations || []).reduce((acc, location) => {
          if (location?._id) {
            acc[location._id] = location;
          }
          return acc;
        }, {} as { [key: string]: Location });
        setLocationsMap(locationMap);

        // Set participants (with checks)
        setParticipantsList(fetchedParticipants || []);
        const participantsMap = (fetchedParticipants || []).reduce(
          (acc, participant) => {
            if (participant?._id) {
              acc[participant._id] = participant;
            }
            return acc;
          },
          {} as { [key: string]: User }
        );
        setParticipantsMap(participantsMap);
      } catch (error: any) {
        setError(error.message || "Failed to fetch data");
        console.error("Error fetching data:", error);
        toast.error(error.message || "Failed to fetch data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [refreshTrigger]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        openDropdown &&
        !(event.target as Element).closest(".dropdown-container")
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [openDropdown]);

  const refreshData = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const getLocationString = (location: Location | string) => {
    if (
      typeof location === "object" &&
      location !== null &&
      "address" in location
    ) {
      return `${location.address}, ${location.city}, ${location.country}`;
    }

    if (typeof location === "string") {
      const locationData = locationsMap[location];
      if (locationData) {
        return `${locationData.address}, ${locationData.city}, ${locationData.country}`;
      }
    }

    return "Location not found";
  };

  //   open event modal with event data
  const handleEditClick = (event: Event) => {
    setSelectedEvent(event);
    // Format date to YYYY-MM-DD for input type="date"
    const formattedDate = new Date(event.date).toISOString().split("T")[0];

    reset({
      name: event.name,
      sportType: event.sportType,
      date: formattedDate,
      location: event.location,
      description: event.description,
    });
    setIsEditModalOpen(true);
  };

  //   create event
  const createEvent = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);

      const eventData = {
        name: data.name,
        description: data.description,
        sportType: data.sportType,
        date: new Date(data.date),
        location: data.location,
        participants: [],
      };

      const createdEvent = await eventService.createEvent(eventData);
      toast.success("Event created successfully!");
      reset({
        name: "",
        description: "",
        sportType: "",
        date: "",
        location: "",
      });
      setIsCreateModalOpen(false);
      refreshData();

      return createdEvent;
    } catch (error: any) {
      console.error("Error creating event:", error);
      toast.error(error.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };
  // update event
  const updateEvent = async (data: EventFormData) => {
    try {
      setIsSubmitting(true);

      if (!selectedEvent?._id) return;

      const eventData = {
        name: data.name,
        description: data.description,
        sportType: data.sportType,
        date: new Date(data.date),
        location: data.location,
        participants: selectedEvent.participants || [],
      };

      const updatedEvent = await eventService.updateEvent(
        selectedEvent._id,
        eventData
      );

      toast.success("Event updated successfully!");

      reset({
        name: "",
        description: "",
        sportType: "",
        date: "",
        location: "",
      });

      setIsEditModalOpen(false);
      setSelectedEvent(null);
      refreshData();

      return updatedEvent;
    } catch (error: any) {
      console.error("Error updating event:", error);
      toast.error(error.message || "Failed to update event");
    } finally {
      setIsSubmitting(false);
    }
  };
  //delete event
  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;

    try {
      setIsDeleting(true);
      await eventService.deleteEvent(eventToDelete);

      toast.success("Event deleted successfully!");
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
      refreshData();
    } catch (error: any) {
      console.error("Error deleting event:", error);
      toast.error(error.message || "Failed to delete event");
    } finally {
      setIsDeleting(false);
    }
  };

  // handle adding participant to event
  // Convert participants to options format
  const participantOptions: ParticipantOption[] = participantsList.map(
    (participant) => ({
      value: participant._id,
      label: participant.fullname || participant.username,
    })
  );
  // Convert events to options format
  const eventOptions: EventOption[] = events.map((event) => ({
    value: event._id,
    label: event.name,
  }));

  const handleParticipantChange = (selected: readonly ParticipantOption[]) => {
    setSelectedParticipants(selected as ParticipantOption[]);
  };

  const handleEventChange = (selected: EventOption | null) => {
    setSelectedEvent(selected);
  };

  const addParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParticipants.length || !selectedEvent) {
      toast.error("Please select both event and participants");
      return;
    }

    try {
      setIsAddingParticipants(true);

      // Process all participants sequentially
      await Promise.all(
        selectedParticipants.map((participant) =>
          eventService.addParticipant(selectedEvent.value, participant.value)
        )
      );

      toast.success("Participants added successfully!");
      setIsAddParticipantModalOpen(false);
      setSelectedParticipants([]);
      setSelectedEvent(null);
      refreshData();
    } catch (error: any) {
      console.error("Error adding participants:", error);
      toast.error(error.message || "Failed to add participants");
    } finally {
      setIsAddingParticipants(false);
    }
  };

  return (
    <section className="dark:bg-gray-900 p-3 sm:p-5">
      <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
        <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <label htmlFor="simple-search" className="sr-only">
                  Search
                </label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-500 dark:text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="simple-search"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    placeholder="Search"
                    required
                  />
                </div>
              </form>
            </div>
            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                type="button"
                className="flex items-center justify-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              >
                <svg
                  className="h-3.5 w-3.5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  />
                </svg>
                Add event
              </button>
              <button
                onClick={() => setIsAddParticipantModalOpen(true)}
                type="button"
                className="flex items-center justify-center text-primary-700 bg-white ring-1 ring-primary-700 hover:bg-primary-800 hover:text-white focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
              >
                <svg
                  className="h-3.5 w-3.5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  />
                </svg>
                Add participant
              </button>
              <div className="flex items-center space-x-3 w-full md:w-auto">
                <button
                  id="actionsDropdownButton"
                  data-dropdown-toggle="actionsDropdown"
                  className="w-full md:w-auto flex items-center justify-center py-2 px-4 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-primary-700 focus:z-10 focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
                  type="button"
                >
                  <svg
                    className="-ml-1 mr-1.5 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      clip-rule="evenodd"
                      fill-rule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    />
                  </svg>
                  Actions
                </button>
                <div
                  id="actionsDropdown"
                  className="hidden z-10 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
                >
                  <ul
                    className="py-1 text-sm text-gray-700 dark:text-gray-200"
                    aria-labelledby="actionsDropdownButton"
                  >
                    <li>
                      <a
                        href="#"
                        className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Mass Edit
                      </a>
                    </li>
                  </ul>
                  <div className="py-1">
                    <a
                      href="#"
                      className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Delete all
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {error && (
              <div className="text-center py-4 text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            {!isLoading && !error && (
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">
                      Event name
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Sport type
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Locaion
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Date
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Created at
                    </th>
                    <th scope="col" className="px-4 py-3">
                      Update at
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {events.map((event, key) => {
                    return (
                      <tr className="border-b dark:border-gray-700" key={key}>
                        <th
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          {event?.name}
                        </th>
                        <td className="px-4 py-3">{event?.sportType}</td>
                        <td className="px-4 py-3">
                          {getLocationString(event.location)}{" "}
                        </td>
                        <td className="px-4 py-3">
                          {" "}
                          {new Date(event?.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3">
                          {event?.createdAt
                            ? new Date(event.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="px-4 py-3">
                          {event?.updatedAt
                            ? new Date(event.updatedAt).toLocaleDateString()
                            : "-"}
                        </td>

                        <td className="px-4 py-3 flex items-center justify-end relative dropdown-container">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdown(
                                openDropdown === event._id ? null : event._id
                              );
                            }}
                            className="inline-flex items-center p-0.5 text-sm font-medium text-center text-gray-500 hover:text-gray-800 rounded-lg focus:outline-none dark:text-gray-400 dark:hover:text-gray-100"
                            type="button"
                          >
                            <svg
                              className="w-5 h-5"
                              aria-hidden="true"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                            </svg>
                          </button>
                          <div
                            className={`absolute right-0 top-full mt-1 w-44 bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 z-10 ${
                              openDropdown === event._id ? "block" : "hidden"
                            }`}
                          >
                            <ul className="py-1 text-sm text-gray-700 dark:text-gray-200">
                              <li>
                                <Link
                                  to="#"
                                  onClick={() => setOpenDropdown(null)}
                                  className="block py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                  Show
                                </Link>
                              </li>
                              <li>
                                <button
                                  onClick={() => {
                                    setOpenDropdown(null);
                                    handleEditClick(event);
                                  }}
                                  className="block w-full text-left py-2 px-4 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                  Edit
                                </button>
                              </li>
                            </ul>
                            <div className="py-1">
                              <button
                                onClick={() => {
                                  setOpenDropdown(null);
                                  setIsDeleteModalOpen(true);
                                  setEventToDelete(event._id);
                                }}
                                className="block w-full text-left py-2 px-4 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {events.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center">
                      No events found
                    </td>
                  </tr>
                )}
              </table>
            )}
          </div>
          {/* pagination */}
        </div>
      </div>
      {/* create event modal */}
      <CustomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create New Event Form"
      >
        <form onSubmit={handleSubmit(createEvent)}>
          <div className="grid gap-4 mb-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Name
                <span className="ml-1 text-red-500">*</span>
              </label>
              <FormInput
                type="text"
                id="name"
                {...register("name")}
                placeholder="Enter event name"
              />
              {errors.name && (
                <p className="mt-1 ml-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="sportType"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Sport type
                <span className="ml-1 text-red-500">*</span>
              </label>
              <FormInput
                type="text"
                id="sportType"
                {...register("sportType")}
                placeholder="Enter sport type"
              />
              {errors.sportType && (
                <p className="mt-1 ml-1 text-sm text-red-600">
                  {errors.sportType.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="date"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Event date
                <span className="ml-1 text-red-500">*</span>
              </label>
              <FormInput
                type="date"
                id="date"
                {...register("date")}
                placeholder="Enter event date"
              />
              {errors.date && (
                <p className="mt-1 ml-1 text-sm text-red-600">
                  {errors.date.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="location"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Location
                <span className="ml-1 text-red-500">*</span>
              </label>
              <LocationSelect
                register={register}
                errors={errors}
                isLoading={isLoading}
                locations={locationsList}
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
                <span className="ml-1 text-red-500">*</span>
              </label>
              <textarea
                id="description"
                {...register("description")}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Write event description here"
              ></textarea>
              {errors.description && (
                <p className="mt-1 ml-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating...
              </>
            ) : (
              <>
                <svg
                  className="mr-1 -ml-1 w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add new event
              </>
            )}
          </button>
        </form>
      </CustomModal>
      {/* edit event modal */}
      <CustomModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedEvent(null);
          reset();
        }}
        title="Edit Event Form"
      >
        <form onSubmit={handleSubmit(updateEvent)}>
          <div className="grid gap-4 mb-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Name
                <span className="ml-1 text-red-500">*</span>
              </label>
              <FormInput
                type="text"
                id="name"
                {...register("name")}
                placeholder="Enter event name"
              />
              {errors.name && (
                <p className="mt-1 ml-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="sportType"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Sport type
                <span className="ml-1 text-red-500">*</span>
              </label>
              <FormInput
                type="text"
                id="sportType"
                {...register("sportType")}
                placeholder="Enter sport type"
              />
              {errors.sportType && (
                <p className="mt-1 ml-1 text-sm text-red-600">
                  {errors.sportType.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="date"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Event date
                <span className="ml-1 text-red-500">*</span>
              </label>
              <FormInput
                type="date"
                id="date"
                {...register("date")}
                placeholder="Enter event date"
              />
              {errors.date && (
                <p className="mt-1 ml-1 text-sm text-red-600">
                  {errors.date.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="location"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Location
                <span className="ml-1 text-red-500">*</span>
              </label>
              <LocationSelect
                register={register}
                errors={errors}
                isLoading={isLoading}
                locations={locationsList}
              />
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="description"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Description
                <span className="ml-1 text-red-500">*</span>
              </label>
              <textarea
                id="description"
                {...register("description")}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                placeholder="Write event description here"
              ></textarea>
              {errors.description && (
                <p className="mt-1 ml-1 text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Updating...
              </>
            ) : (
              <>
                <svg
                  className="mr-1 -ml-1 w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Update event
              </>
            )}
          </button>
        </form>
      </CustomModal>
      {/* delete event modal */}
      <div
        className={`${
          isDeleteModalOpen ? "block" : "hidden"
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full min-h-screen bg-gray-900/50 backdrop-blur-sm`}
      >
        <div className="relative p-4 w-full max-w-md">
          <div className="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
            <button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              className="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
              data-modal-toggle="deleteModal"
            >
              <svg
                aria-hidden="true"
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="sr-only">Close modal</span>
            </button>
            <svg
              className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <p className="mb-4 text-gray-500 dark:text-gray-300">
              Are you sure you want to delete this event?
            </p>
            <div className="flex justify-center items-center space-x-4">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                No, cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteEvent}
                disabled={isDeleting}
                className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 dark:bg-red-500 dark:hover:bg-red-600 dark:focus:ring-red-900"
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Yes, I'm sure"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* add participant */}
      <CustomModal
        isOpen={isAddParticipantModalOpen}
        onClose={() => {
          setIsAddParticipantModalOpen(false);
          setSelectedParticipants([]);
          setSelectedEvent(null);
        }}
        title="Add Participants to Event"
      >
        <form onSubmit={addParticipant} className="space-y-4">
          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {/* Event Selection */}
            <div className="space-y-2">
              <label
                htmlFor="event"
                className="block text-sm font-medium text-gray-700"
              >
                Select Event
              </label>
              <Select
                id="event"
                options={eventOptions}
                value={selectedEvent}
                onChange={handleEventChange}
                className="basic-select"
                classNamePrefix="select"
                placeholder="Select event..."
                isSearchable
                isDisabled={isAddingParticipants}
              />
            </div>

            {/* Participants Selection */}
            <div className="space-y-2">
              <label
                htmlFor="participants"
                className="block text-sm font-medium text-gray-700"
              >
                Select Participants
              </label>
              <Select
                id="participants"
                isMulti
                options={participantOptions}
                value={selectedParticipants}
                onChange={handleParticipantChange}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder="Select participants..."
                isSearchable
                closeMenuOnSelect={false}
                maxMenuHeight={200}
                menuPlacement="auto"
                isDisabled={isAddingParticipants}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t mt-4">
            <button
              type="button"
              onClick={() => {
                setIsAddParticipantModalOpen(false);
                setSelectedParticipants([]);
                setSelectedEvent(null);
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isAddingParticipants}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed"
              disabled={
                isAddingParticipants ||
                selectedParticipants.length === 0 ||
                !selectedEvent
              }
            >
              {isAddingParticipants ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Adding...
                </span>
              ) : (
                "Add Participants"
              )}
            </button>
          </div>
        </form>
      </CustomModal>
    </section>
  );
};
export default EventsTable;
