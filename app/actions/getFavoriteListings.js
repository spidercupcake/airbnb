import dbConnect from "@/lib/mongooseClient";
import getCurrentUser from "./getCurrentUser";
import { ObjectId } from "mongodb";

export default async function getFavoriteListings() {
  try {
    // Connect to the database
    const db = await dbConnect();
    const usersCollection = db.collection("users");
    const listingsCollection = db.collection("Listing");

    // Get the current user
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser._id) {
      return [];
    }

    const userId = currentUser._id;

    // Retrieve the user's favorite listing IDs
    const user = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { favorites: 1 } }
    );

    if (!user || !user.favorites || user.favorites.length === 0) {
      return [];
    }

    // Fetch listings for the user's favorites
    const listings = await listingsCollection
      .find({ _id: { $in: user.favorites.map((id) => new ObjectId(id)) } })
      .toArray();

    // Ensure plain JavaScript objects are returned
    return listings.map((listing) => ({
      ...listing,
      _id: listing._id.toString(), // Convert ObjectId to string for serialization
    }));
  } catch (error) {
    console.error("Error in getFavoriteListings:", error);
    return [];
  }
}
