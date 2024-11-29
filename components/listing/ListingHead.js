"use client";

import useCountries from "@/hook/useCountries";
import Image from "next/image";
import Heading from "../Heading";
import HeartButton from "../HeartButton";

function ListingHead({
  title,
  locationValue,
  imageSrc,
  id,
  currentUser,
}) {
  const { getByValue } = useCountries();
  const location = getByValue(locationValue);
  console.log("Id Passed to Heart:", id);

  return (
    <>
      <Heading
        title={title}
        subtitle={`${location?.region}, ${location?.label}`}
      />
      <div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.5,
          ease: [0, 0.71, 0.2, 1.01],
        }}
        className="w-full h-[60vh] overflow-hidden rounded-xl relative"
      >
        <Image
          src={imageSrc}
          alt="image"
          fill
          className="object-cover w-full"
        />
        
        <div className="absolute top-5 right-5">
          <HeartButton listingId={id} currentUser={currentUser} />
        </div>
      </div>
    </>
  );
}

export default ListingHead;
