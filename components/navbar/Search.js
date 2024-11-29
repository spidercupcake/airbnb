"use client";

import useCountries from "@/hook/useCountries";
import { differenceInDays } from "date-fns";
import { useSearchParams, useRouter } from "next/navigation"; // Updated to use router for navigation
import { useMemo, useState } from "react";
import { BiSearch } from "react-icons/bi";

function Search() {
    const router = useRouter();  // Using Next.js router to programmatically update URL
    const params = useSearchParams();
    const { getAll, getByValue } = useCountries();

    // Dropdown state
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);

    const locationValue = params?.get("locationValue");
    const startDate = params?.get("startDate");
    const endDate = params?.get("endDate");
    const guestCount = params?.get("guestCount");

    // Country selection handling
    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setDropdownVisible(false); // Hide the dropdown after selection

        // Update the URL with the selected country value (locationValue)
        const newParams = new URLSearchParams(params.toString());
        newParams.set("locationValue", country.value);  // Update locationValue parameter
        router.push(`?${newParams.toString()}`);  // Update the URL with new params
    };

    const locationLabel = useMemo(() => {
        if (selectedCountry) {
            return selectedCountry.label; // Use selected country if available
        }
        if (locationValue) {
            return getByValue(locationValue)?.label;
        }
        return "Anywhere";
    }, [selectedCountry, getByValue, locationValue]);

    const durationLabel = useMemo(() => {
        if (startDate && endDate) {
            const start = new Date(startDate);
            const end = new Date(endDate);
            let diff = differenceInDays(end, start);

            if (diff === 0) {
                diff = 1;
            }

            return `${diff} Days`;
        }
        return "Any Week";
    }, [startDate, endDate]);

    const guessLabel = useMemo(() => {
        if (guestCount) {
            return `${guestCount} Guests`;
        }
        return "Add Guests";
    }, [guestCount]);

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    return (
        <div className="relative w-full md:w-auto">
            <div
                onClick={toggleDropdown}
                className="border-[1px] w-full py-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer"
            >
                <div className="flex flex-row items-center justify-between">
                    <div className="text-sm font-semibold px-6">{locationLabel}</div>
                    <div className="hidden sm:block text-losm font-semibold px-6 border-x-[1px] flex-1 text-center">
                        {durationLabel}
                    </div>
                    <div className="text-sm pl-6 pr-2 text-gray-600 flex flex-row items-center gap-3">
                        <div className="hidden sm:block text-center">{guessLabel}</div>
                        <div className="p-2 bg-rose-500 rounded-full text-white">
                            <BiSearch size={18} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Country Dropdown */}
            {dropdownVisible && (
                <div className="absolute top-full mt-2 w-full bg-white shadow-lg rounded-lg max-h-60 overflow-y-auto z-10">
                    <ul>
                        {getAll().map((country) => (
                            <li
                                key={country.value}
                                onClick={() => handleCountrySelect(country)}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            >
                                {country.flag} {country.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default Search;
