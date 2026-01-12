const Budget = require('../models/Budget');
const moment = require('moment');

// @desc    Get current month's budget
// @route   GET /api/budget/current
// @access  Private
const getCurrentBudget = async (req, res) => {
  try {
    const month = moment().month() + 1;
    const year = moment().year();

    const budget = await Budget.findOne({
      user: req.user.id,
      month,
      year,
    });

    res.json(budget || { amount: 0 });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Set/Update budget
// @route   POST /api/budget
// @access  Private
const setBudget = async (req, res) => {
  try {
    const { amount, month, year } = req.body;
    const currentMonth = month || moment().month() + 1;
    const currentYear = year || moment().year();

    let budget = await Budget.findOne({
      user: req.user.id,
      month: currentMonth,
      year: currentYear,
    });

    if (budget) {
      // Update existing budget
      budget.amount = amount;
      await budget.save();
    } else {
      // Create new budget
      budget = await Budget.create({
        user: req.user.id,
        month: currentMonth,
        year: currentYear,
        amount,
      });
    }

    res.status(201).json(budget);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get budget history
// @route   GET /api/budget/history
// @access  Private
const getBudgetHistory = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id })
      .sort({ year: -1, month: -1 })
      .limit(12);

    res.json(budgets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getCurrentBudget,
  setBudget,
  getBudgetHistory,
};