const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  routeId: {
    type: String,
    required: true,
    unique: true
  },
  truck: {
    type: String,
    required: true
  },
  municipalCouncil: {
    type: String,
    required: true
  },
  distance: {
    type: String,
    required: true
  },
  estimatedTime: {
    type: String,
    default: null
  },
  estimatedTimeMinutes: {
    type: Number,
    default: null
  },
  status: {
    type: String,
    required: true,
    default: 'Optimized'
  },
  points: [{
    lat: Number,
    lng: Number,
    id: String
  }],
  route: [{
    lat: Number,
    lng: Number
  }],
  roadRoute: [{
    lat: Number,
    lng: Number
  }],
  dispatched: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
routeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Route', routeSchema);