const mongoose = require('mongoose');

const adminEntrySchema = new mongoose.Schema({
  unid: {
    type: String,
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
    index: true
  },
  breakfast: {
    type: Boolean,
    default: false
  },
  lunch: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Ensure one record per user (unid) per date
adminEntrySchema.index({ unid: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('adminEntry', adminEntrySchema);
