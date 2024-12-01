"use client";

import { useMemo } from "react";
import useCountries from "@/hook/useCountries";
import Select from "react-select";
import Flag from "react-world-flags";

function CountrySelect({ value, onChange }) {
  const { getAll } = useCountries();

  // Memoize countries to avoid re-computation
  const countryOptions = useMemo(() => getAll(), [getAll]);

  return (
    <div>
      <Select
        placeholder="Anywhere"
        isClearable
        options={countryOptions}
        value={value}
        onChange={onChange}
        formatOptionLabel={(option) => (
          <div className="flex flex-row items-center gap-3">
            {/* Add fallback for flag */}
            {option.value ? (
              <Flag code={option.value} className="w-5" />
            ) : (
              <span className="text-gray-500">🏳</span>
            )}
            <div>
              {option.label},
              <span className="text-neutral-500 ml-1">{option.region}</span>
            </div>
          </div>
        )}
        // Abstracted class names
        classNames={{
          control: () => "p-3 border-2",
          input: () => "text-lg",
          option: () => "text-lg",
        }}
        // Theme adjustments
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: "black",
            primary25: "#ffe4e6",
          },
        })}
      />
    </div>
  );
}

export default CountrySelect;
