const User = require('../models/User'); // Import the User model
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose'); // Import mongoose if using object IDs

/**
 * Generates a JSON Web Token (JWT) for the authenticated user.
 * The secret key is stored in your .env file (process.env.JWT_SECRET).
 * @param {mongoose.Types.ObjectId} id - The user's MongoDB ID.
 * @returns {string} The JWT.
 */
const generateToken = (id) => {
    // Ensure you have JWT_SECRET defined in your .env file
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

class AuthenticationService {
    /**
     * Validates user credentials against the database and returns a token and user ID.
     * @param {string} email 
     * @param {string} password 
     * @returns {object | null} Object containing { token, userId } or null if validation fails.
     */
    static async validateUser(email, password) {
        // 1. Find user by email in the database
        const user = await User.findOne({ email });

        // 2. Check if user exists and password is correct (using bcrypt via User model method)
        // The user model handles the bcrypt comparison internally.
        if (user && (await user.matchPassword(password))) {
            
            // 3. Authentication successful: Generate and return a token and user ID
            return {
                token: generateToken(user._id),
                userId: user._id.toString() // Convert ObjectId to string for the frontend
            };
        }

        // 4. Authentication failed
        return null;
    }
}

module.exports = AuthenticationService;
