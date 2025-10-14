const mongoose = require('mongoose');

// Re-export the same User model used by auth to avoid duplicate collections
const User = mongoose.models.User || require('../auth/model');

module.exports = User;
