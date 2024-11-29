import dbConnect from "@/lib/mongooseClient";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { ObjectId } from "mongodb";

export async function POST(req) {
  try {
    // Connect to the database
    const db = await dbConnect();
    
    // Access the 'users' collection directly
    const usersCollection = db.collection("users");

    // Parse the request body
    const { favoriteListingId } = await req.json();

    // Validate input
    if (!favoriteListingId) {
      return new Response(
        JSON.stringify({ message: "Favorite listing ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get the current user (you would retrieve this from session, JWT, or other means)
    const currentUser = await getCurrentUser();

    if (!currentUser || !currentUser._id) {
      return new Response(
        JSON.stringify({ message: "User not found or not authenticated" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const userId = currentUser._id;

    // Ensure the _id is a valid ObjectId
    if (!ObjectId.isValid(userId)) {
      return new Response(
        JSON.stringify({ message: "Invalid user ID" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update the user's favorites collection
    const updatedUser = await usersCollection.findOneAndUpdate(
      { _id: new ObjectId(userId) }, // Ensure _id is an ObjectId
      {
        $addToSet: { favorites: favoriteListingId }, // Add to favorites only if not already present
      },
      { returnDocument: "after" } // Return the updated document
    );

    // Check if the user document was returned after the update
    if (!updatedUser || !updatedUser.value) {
      return new Response(
        JSON.stringify({ message: "User not found or update failed" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Return success response with the updated user information
    return new Response(
      JSON.stringify({
        message: "Favorite added successfully",
        user: updatedUser.value,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Error in favorites API:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
