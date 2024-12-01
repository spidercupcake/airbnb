"use client";

import useCountries from "@/hook/useCountries";
import { useSearchParams, useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { BiSearch } from "react-icons/bi";

function Search() {
    const router = useRouter();
    const params = useSearchParams();
    const { getAll, getByValue } = useCountries();

    // State
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState(null);

    const locationValue = params?.get("locationValue");

    // Handle country selection
    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setDropdownVisible(false); // Hide dropdown
        updateSearchParams({ locationValue: country.value });
    };

    const updateSearchParams = (newParamsObj) => {
        const newParams = new URLSearchParams(params?.toString());
        Object.entries(newParamsObj).forEach(([key, value]) => {
            if (value) {
                newParams.set(key, value);
            } else {
                newParams.delete(key);
            }
        });
        router.push(`?${newParams.toString()}`);
    };

    const locationLabel = useMemo(() => {
        if (selectedCountry) return selectedCountry.label;
        if (locationValue) return getByValue(locationValue)?.label;
        return "Anywhere";
    }, [selectedCountry, getByValue, locationValue]);

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
                <div className="flex flex-row items-center justify-between px-8">
                    <div className="text-md font-semibold px-6">{locationLabel}</div>
                    <div className="p-2 bg-rose-500 rounded-full text-white flex items-center">
                        <BiSearch size={18} />
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
