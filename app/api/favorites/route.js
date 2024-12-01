import dbConnect from "@/lib/mongooseClient";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    // Connect to the database
    const db = await dbConnect();
    const usersCollection = db.collection("users");

    // Parse the request body
    const { favoriteListingId } = await req.json();
    if (!favoriteListingId) {
      return new Response(
        JSON.stringify({ message: "Favorite listing ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Retrieve the current user
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

    // Update user's favorites
    const updateResult = await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { $addToSet: { favorites: favoriteListingId } } // Add to favorites if not present
    );

    if (!updateResult.matchedCount) {
      return new Response(
        JSON.stringify({ message: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ message: "Favorite added successfully" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in favorites API:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

export async function GET() {
  try {
    const db = await dbConnect();
    const usersCollection = db.collection("users");
    const listingsCollection = db.collection("listings"); // Ensure collection name matches your database

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

    // Fetch the user's favorites
    const user = await usersCollection.findOne(
      { _id: new ObjectId(userId) },
      { projection: { favorites: 1 } }
    );

    if (!user || !user.favorites || user.favorites.length === 0) {
      console.log("No favorites found for user:", userId); // Debugging log
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Convert string IDs to ObjectId
    const favoriteIds = user.favorites.map((id) =>
      ObjectId.isValid(id) ? new ObjectId(id) : null
    ).filter(Boolean); // Filter out any invalid IDs

    if (favoriteIds.length === 0) {
      console.log("No valid favorite IDs found for user:", userId); // Debugging log
      return new Response(JSON.stringify([]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch the favorite listings
    const listings = await listingsCollection
      .find({ _id: { $in: favoriteIds } })
      .toArray();

    console.log("Fetched Listings:", listings); // Debugging log

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
