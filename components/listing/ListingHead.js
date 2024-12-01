"use client";

import useCountries from "@/hook/useCountries";
import Image from "next/image";
import Heading from "../Heading";
import HeartButton from "../HeartButton";

function ListingHead({
  title,
  locationValue,
  imageSrc,  // Array of image paths
  id,
  currentUser,
}) {
  const { getByValue } = useCountries();
  const location = getByValue(locationValue);

  return (
    <>
      <Heading
        title={title}
        subtitle={`${location?.region}, ${location?.label}`}
      />
      <div className="w-full h-[60vh] relative rounded-xl overflow-hidden flex gap-4">
        {/* Main Image (Left) */}
        <div className="relative w-2/3 h-full rounded-xl overflow-hidden shadow-md">
          <Image
            src={imageSrc[0]}  // Main image
            alt="Main Image"
            fill
            className="object-cover w-full h-full rounded-xl"
          />
        </div>

        {/* Side Images (Right - stacked) */}
        <div className="w-1/3 flex flex-col gap-4">
          <div className="relative w-full h-1/2 rounded-xl overflow-hidden shadow-md">
            <Image
              src={imageSrc[1]}  // Second image
              alt="Side Image 1"
              fill
              className="object-cover w-full h-full rounded-xl"
            />
          </div>
          <div className="relative w-full h-1/2 rounded-xl overflow-hidden shadow-md">
            <Image
              src={imageSrc[2]}  // Third image
              alt="Side Image 2"
              fill
              className="object-cover w-full h-full rounded-xl"
            />
          </div>
        </div>

        {/* Heart Button */}
        <div className="absolute top-5 right-5">
          <HeartButton listingId={id} currentUser={currentUser} />
        </div>
      </div>
    </>
  );
}

export default ListingHead;
