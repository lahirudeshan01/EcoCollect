const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user', index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', UserSchema);
