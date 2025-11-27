// controllers/canteenController.js
const CanteenCount = require('../models/CanteenCount');
const adminEntry = require('../models/adminEntry');
const mongoose = require('mongoose');

exports.createOrUpdateRecordForAdmin = async (req, res) => {
  const { unid, date, breakfast, lunch } = req.body;

  if (!unid || !date) {
    return res.status(400).json({ error: 'unid and date are required' });
  }

  try {
    const formattedDate = new Date(date);
    formattedDate.setUTCHours(0, 0, 0, 0); // Normalize to start of day

    const updatedRecord = await adminEntry.findOneAndUpdate(
      { date: formattedDate },
      { $set: { breakfast, lunch } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(updatedRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Create or update a record
exports.createOrUpdateRecord = async (req, res) => {
  const { user, date, breakfast, lunch, lFasting, bFasting } = req.body;
  if (!mongoose.Types.ObjectId.isValid(user)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const formattedDate = new Date(date);
    formattedDate.setUTCHours(0, 0, 0, 0); // Normalize to start of day

    const updatedRecord = await CanteenCount.findOneAndUpdate(
      { user, date: formattedDate },
      { $set: { breakfast, lunch, lFasting, bFasting } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(updatedRecord);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAdminEntries = async (req, res) => {
  try {
    const records = await adminEntry.find({})
    return res.json(records)
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
}

const moment = require('moment-timezone');

exports.getAllRecords = async (req, res) => {
  const { date, userId, timezone = 'UTC' } = req.query;

  if (!date) {
    return res.status(400).json({ error: 'Date query param is required' });
  }

  try {
    let parsedDate;

    // Try ISO format first (YYYY-MM-DD)
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      parsedDate = moment.tz(date, "YYYY-MM-DD", true, timezone);
    }
    // Try DD/MM/YYYY
    else if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      parsedDate = moment.tz(date, "DD/MM/YYYY", true, timezone);
    }
    // Invalid format
    else {
      return res.status(400).json({
        error: "Invalid date format. Use YYYY-MM-DD or DD/MM/YYYY."
      });
    }

    // Validate the result
    if (!parsedDate.isValid()) {
      return res.status(400).json({ error: "Invalid date value." });
    }

    const startOfDay = parsedDate.clone().startOf('day').toDate();
    const endOfDay = parsedDate.clone().endOf('day').toDate();

    let records;

    if (userId) {
      records = await CanteenCount.find({
        user: userId
      }).populate("user", "itkey type");
    } else {
      records = await CanteenCount.find({
        date: { $gte: startOfDay, $lte: endOfDay }
      }).populate("user", "itkey type");
    }

    const breakfastCount = records.filter(r => r.breakfast).length;
    const lunchCount = records.filter(r => r.lunch).length;

    res.status(200).json({
      records,
      breakfastCount,
      lunchCount
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};



  
  