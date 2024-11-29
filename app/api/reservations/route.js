import getCurrentUser from "@/app/actions/getCurrentUser";
const { ObjectId } = require('mongodb');
import dbConnect from "@/lib/mongooseClient";
import { NextResponse } from "next/server";

export async function POST(request) {
  console.log("API call initiated...");

  const currentUser = await getCurrentUser();

  if (!currentUser) {
    console.error("No current user found.");
    return NextResponse.error();
  }

  const body = await request.json();
  console.log("Request body:", body);

  const { listingId, startDate, endDate, totalPrice, startTime, endTime, totalHours, crewCount } = body;

  // Validate required fields
  if (!listingId || !startDate || !endDate || !startTime || !endTime || totalPrice === undefined || totalHours === undefined || crewCount === undefined) {
    console.error("Missing required fields:", {
      listingId, startDate, endDate, startTime, endTime, totalPrice, totalHours, crewCount,
    });
    return NextResponse.error();
  }

  // Convert startDate and endDate to Date objects
  const startDateTime = new Date(startDate);
  const endDateTime = new Date(endDate);

  try {
    await dbConnect(); // Ensure the database connection is established
    const db = await dbConnect();
    const reservationsCollection = db.collection("Reservation");

    // Fetch listing details for embedding in reservation
    const listingsCollection = db.collection("Listing");
    const listing = await listingsCollection.findOne({ _id: new ObjectId(listingId) });

    if (!listing) {
      console.error("Listing not found.");
      return NextResponse.error();
    }

    // Structure the reservation data as requested
    const reservationData = {
      userId: currentUser._id,
      listingId: listingId,
      startDate: startDateTime.toISOString(),
      endDate: endDateTime.toISOString(),
      startTime,
      endTime,
      totalHours,
      crewCount,
      totalPrice,
      createdAt: new Date().toISOString(),
      listing: {
        id: listing._id,
        title: listing.title,
        description: listing.description,
        imageSrc: listing.imageSrc,
        category: listing.category,
        roomCount: listing.roomCount,
        bathroomCount: listing.bathroomCount,
        guestCount: listing.guestCount,
        locationValue: listing.locationValue,
        minimumBookingLength: listing.minimumBookingLength,
        crewCount: listing.crewCount,
        area: listing.area,
        userId: listing.userId,
        price: listing.price,
        createdAt: listing.createdAt,
      },
      status: "confirmed",
    };

    // Insert the reservation into the Reservation collection
    const result = await reservationsCollection.insertOne(reservationData);

    console.log("Reservation created successfully:", result);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating reservation:", error);
    return NextResponse.error();
  }
}
