import dbConnect from "@/lib/mongooseClient"; // Adjust the import path to your MongoDB client connection
import getCurrentUser from "./getCurrentUser";
import { ObjectId } from "mongodb"; // Ensure that ObjectId is imported

export default async function getFavoriteListings() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || !Array.isArray(currentUser.favoriteIds)) {
      // If currentUser is null or favoriteIds is not an array, return an empty array
      return [];
    }

    // Connect to the database
    const db = await dbConnect();

    // Fetch favorite listings from the database
    const favorites = await db.collection("Listing").find({
      _id: {
        $in: currentUser.favoriteIds.map(id => new ObjectId(id)), // Convert string IDs to ObjectId
      },
    }).toArray();

    // Map through favorites and convert createdAt to ISO string
    const safeFavorites = favorites.map((favorite) => ({
      ...favorite,
      createdAt: favorite.createdAt.toISOString(), // Convert to ISO string
    }));

    return safeFavorites;
  } catch (error) {
    console.error("Error in getFavoriteListings:", error); // Log the error for debugging
    throw new Error(error.message);
  }
}
