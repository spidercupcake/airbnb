import { useState, useEffect } from "react";

const useFavorite = ({ listingId, currentUser }) => {
  const [hasFavorite, setHasFavorite] = useState(false);

  useEffect(() => {
    if (currentUser?.favoriteIds?.includes(listingId)) {
      setHasFavorite(true); // Set to true if the listing is in the user's favorites
    }
  }, [currentUser, listingId]);

  const toggleFavorite = async () => {
    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ listingId }),
      });

      // Check for response status and log it for debugging
      if (!response.ok) {
          const errorResponse = await response.text(); // Use .text() to check the raw response
          console.error("Error response:", errorResponse);
          return; 
      }

      // If request was successful, toggle the favorite status
      setHasFavorite(!hasFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error); // Log general error if any
    }
  };

  // Return only the primitive values
  return { hasFavorite, toggleFavorite };
};

export default useFavorite;
