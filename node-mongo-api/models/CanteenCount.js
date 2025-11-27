// models/CanteenCount.js
const mongoose = require('mongoose');

const canteenCountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  breakfast: {
    type: Boolean,
    default: false,
  },
  bFasting: {
    type: Boolean,
    default: false,
  },
  lFasting: {
    type: Boolean,
    default: false,
  },
  lunch: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

module.exports = mongoose.model('CanteenCount', canteenCountSchema);
