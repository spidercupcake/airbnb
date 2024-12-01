import dbConnect from "@/lib/mongooseClient";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    // Connect to the database
    const db = await dbConnect();
    const usersCollection = db.collection("users");
    const listingsCollection = db.collection("listings"); // Adjust name if necessary

    // Get the current user
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser._id) {
      return new Response(
        JSON.stringify({ message: "User not found or not authenticated" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = currentUser._id;
    if (!ObjectId.isValid(userId)) {
      return new Response(
        JSON.stringify({ message: "Invalid user ID" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Retrieve the user's favorite listing IDs
    const user = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { favorites: 1 } }
    );

    if (!user || !user.favorites || user.favorites.length === 0) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Convert favorite IDs from strings to ObjectId
    const favoriteIds = user.favorites.map((id) =>
      ObjectId.isValid(id) ? new ObjectId(id) : null
    ).filter(Boolean); // Remove invalid IDs

    if (favoriteIds.length === 0) {
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch the listings based on favorite IDs
    const listings = await listingsCollection
      .find({ _id: { $in: favoriteIds } })
      .toArray();

    return new Response(JSON.stringify(listings), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET favorites API:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
