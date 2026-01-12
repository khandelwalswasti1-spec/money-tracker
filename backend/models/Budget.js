const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: true,
    min: 2000,
    max: 2100,
  },
  amount: {
    type: Number,
    required: [true, 'Please add a budget amount'],
    min: [0, 'Budget must be positive'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure one budget per user per month-year combination
budgetSchema.index({ user: 1, month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('Budget', budgetSchema);