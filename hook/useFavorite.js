import { useState, useEffect } from "react";

const useFavorite = ({ listingId, currentUser }) => {
  console.log("Received listingId in hook:", listingId); // Debug

  const [hasFavorite, setHasFavorite] = useState(false);

  useEffect(() => {
    console.log("Effect triggered. CurrentUser:", currentUser, "ListingId:", listingId);
    if (currentUser?.favorites?.includes(listingId)) {
      setHasFavorite(true);
    }
  }, [currentUser, listingId]);

 const toggleFavorite = async () => {
    console.log("Toggling favorite for:", listingId); // Debug
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ favoriteListingId: listingId }),
      });

      // Log the full response object to inspect its structure
      const responseData = await response.json();
      console.log("API Response Data:", responseData); // This will show if you are getting the expected response

      if (response.ok) {
        // Ensure the expected success message
        if (responseData.message === "Favorite added successfully") {
          setHasFavorite(!hasFavorite); // Toggle the favorite status
        } else {
          console.error("Unexpected response message:", responseData.message);
        }
      } else {
        console.error("Error response:", responseData.message);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return { hasFavorite, toggleFavorite };
};

export default useFavorite;
