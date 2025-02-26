// controllers/location.js
const UserLocation = require("../models/userlocation");
const User = require("../models/user");

// Update user location
async function updateUserLocation(req, res) {
  try {
    const userId = req.userId; // Assuming this is set by your auth middleware
    const { latitude, longitude } = req.body;
    
    // Validate inputs
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "Latitude and longitude are required" });
    }

    // Check if user exists
    const userExists = await User.findById(userId);
    if (!userExists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update or create location entry
    const updatedLocation = await UserLocation.findOneAndUpdate(
      { userId },
      { 
        latitude, 
        longitude,
        lastUpdated: Date.now() 
      },
      { upsert: true, new: true }
    );
    
    return res.status(200).json({
      message: "Location updated successfully",
      location: {
        latitude: updatedLocation.latitude,
        longitude: updatedLocation.longitude,
        lastUpdated: updatedLocation.lastUpdated
      }
    });
  } catch (error) {
    console.error("Error updating location:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

// Get user location
async function getUserLocation(req, res) {
  try {
    const userId = req.userId; // From auth middleware
    
    const location = await UserLocation.findOne({ userId });
    
    if (!location) {
      return res.status(404).json({ error: "Location not found for this user" });
    }
    
    return res.status(200).json({
      location: {
        latitude: location.latitude,
        longitude: location.longitude,
        lastUpdated: location.lastUpdated
      }
    });
  } catch (error) {
    console.error("Error fetching location:", error);
    return res.status(500).json({ error: "Server error" });
  }
}

// Update location on login 
async function updateLocationOnLogin(req, res, next) {
  try {
    const userId = req.userId; // This should be set in the AuthenticateUser function
    const { latitude, longitude } = req.body;
    
    // Skip if no location data provided
    if (!latitude || !longitude) {
      return next();
    }
    
    // Update location silently - don't interrupt login flow
    await UserLocation.findOneAndUpdate(
      { userId },
      { 
        latitude, 
        longitude,
        lastUpdated: Date.now() 
      },
      { upsert: true, new: true }
    );
    
    next();
  } catch (error) {
    console.error("Error updating location during login:", error);
    // Continue login process even if location update fails
    next();
  }
}

module.exports = {
  updateUserLocation,
  getUserLocation,
  updateLocationOnLogin
};