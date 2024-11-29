 import dbConnect from '@/lib/mongooseClient'; // Path to dbConnect
  import getCurrentUser from '@/app/actions/getCurrentUser'; // Function to get the current user
  
  export default async function handler(req, res) {
    // Ensure database connection is established
    await dbConnect();
    const User = db.collection("users");
  
    if (req.method === 'POST') {
      try {
        const { favoriteListingId } = req.body;  // Get favorite listing ID from request
        
        // Get the current user
        const currentUser = await getCurrentUser(); // Assuming this returns the currently authenticated user
        
        if (!currentUser || !currentUser._id) {
          return res.status(404).json({ message: 'User not found or not authenticated' });
        }
  
        // Fetch user from database using the current user's ID
        const userId = currentUser._id;
        const user = await User.findById(userId);
  
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
  
        // Ensure 'favorites' is an array before adding to it
        if (!user.favorites) {
          user.favorites = [];
        }
  // Update favorite listings if not already in favorites
  if (!user.favorites.includes(favoriteListingId)) {
    user.favorites.push(favoriteListingId); // Add the listing to favorites
  }
       
        
        // Save the updated user data
        await user.save();  // This should save the changes now
  
        // Respond with success
        return res.status(200).json({ message: 'Favorite added successfully', user });
      } catch (error) {
        console.error('Error in favorite API:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
      }
    }
  
    // Handle unsupported HTTP methods
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
  