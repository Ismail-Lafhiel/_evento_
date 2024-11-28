import { Location } from "../../types/types";

interface LocationSelectProps {
  register: any;
  errors: any;
  isLoading: boolean;
  locations: Location[];
}

const LocationSelect = ({
  register,
  errors,
  isLoading,
  locations,
}: LocationSelectProps) => {
  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-10 bg-gray-200 rounded dark:bg-gray-700"></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <select
        id="location"
        {...register("location", { required: "Location is required" })}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
      >
        <option value="">Select location</option>
        {locations?.map((location) => (
          <option key={location._id} value={location._id}>
            {location.address}, {location.city}, {location.country}
          </option>
        ))}
      </select>
      {errors.location && (
        <p className="mt-1 ml-1 text-sm text-red-600">
          {errors.location.message as string}
        </p>
      )}
    </div>
  );
};

export default LocationSelect;
