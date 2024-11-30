import { Location } from "../../types/types";
import { MapPinIcon, ChevronUpDownIcon } from "@heroicons/react/24/outline";
import { Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";

interface LocationSelectProps {
  register: any;
  errors: any;
  isLoading: boolean;
  locations: Location[];
  label?: string;
  value?: string;
  onChange?: (value: string) => void;
}

const LocationSelect = ({
  register,
  errors,
  isLoading,
  locations,
  label = "Location",
  value,
  onChange,
}: LocationSelectProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {label && (
          <div className="h-5 w-20 bg-gray-200 rounded dark:bg-gray-700 animate-pulse" />
        )}
        <div className="animate-pulse">
          <div className="h-11 bg-gray-200 rounded-lg dark:bg-gray-700" />
        </div>
      </div>
    );
  }

  const { ref, ...rest } = register("location", {
    required: "Location is required",
  });

  return (
    <div className="relative">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          {label}
        </label>
      )}
      <Listbox
        value={value}
        onChange={(val) => {
          onChange?.(val);
          // Trigger react-hook-form onChange
          const event = {
            target: {
              name: "location",
              value: val,
            },
          };
          rest.onChange(event);
        }}
      >
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 pl-10 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm">
            <span className="block truncate text-gray-900 dark:text-white">
              {value
                ? locations.find((loc) => loc._id === value)
                  ? `${locations.find((loc) => loc._id === value)?.address}, ${
                      locations.find((loc) => loc._id === value)?.city
                    }`
                  : "Select location"
                : "Select location"}
            </span>
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <MapPinIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronUpDownIcon
                className="h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              <div className="py-1">
                {locations.length === 0 ? (
                  <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    No locations available
                  </div>
                ) : (
                  locations.map((location) => (
                    <Listbox.Option
                      key={location._id}
                      value={location._id}
                      className={({ active, selected }) =>
                        `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                          active
                            ? "bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400"
                            : "text-gray-900 dark:text-white"
                        } ${
                          selected
                            ? "bg-primary-50 dark:bg-primary-900/50 text-primary-600 dark:text-primary-400"
                            : ""
                        }`
                      }
                    >
                      {({ selected }) => (
                        <>
                          <span className="block truncate font-medium">
                            {location.address}
                          </span>
                          <span className="block truncate text-sm text-gray-500 dark:text-gray-400">
                            {location.city}, {location.country}
                          </span>
                          {selected && (
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary-600 dark:text-primary-400">
                              <MapPinIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          )}
                        </>
                      )}
                    </Listbox.Option>
                  ))
                )}
              </div>
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>

      {/* Hidden input for react-hook-form */}
      <input type="hidden" {...register("location")} ref={ref} />

      {errors.location && (
        <p className="mt-2 text-sm text-red-600 dark:text-red-500 flex items-center">
          <span className="mr-1">•</span>
          {errors.location.message as string}
        </p>
      )}
    </div>
  );
};

export default LocationSelect;
