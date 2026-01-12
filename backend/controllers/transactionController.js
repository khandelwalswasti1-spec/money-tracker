const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const moment = require('moment');

// @desc    Get all transactions
// @route   GET /api/transactions
// @access  Private
const getTransactions = async (req, res) => {
  try {
    const { startDate, endDate, category, type } = req.query;
    let filter = { user: req.user.id };

    // Filter by date range
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // Filter by category
    if (category) {
      filter.category = category;
    }

    // Filter by type
    if (type) {
      filter.type = type;
    }

    const transactions = await Transaction.find(filter).sort({ date: -1 });
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Add transaction
// @route   POST /api/transactions
// @access  Private
const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;

    const transaction = await Transaction.create({
      user: req.user.id,
      title,
      amount,
      type,
      category,
      date: date || Date.now(),
      notes,
    });

    // Check budget alert if it's an expense
    if (type === 'expense') {
      await checkBudgetAlert(req.user.id, transaction.date, amount);
    }

    res.status(201).json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update transaction
// @route   PUT /api/transactions/:id
// @access  Private
const updateTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;

    let transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check ownership
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    transaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      { title, amount, type, category, date, notes },
      { new: true }
    );

    res.json(transaction);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete transaction
// @route   DELETE /api/transactions/:id
// @access  Private
const deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    // Check ownership
    if (transaction.user.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await transaction.deleteOne();
    res.json({ message: 'Transaction removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/transactions/dashboard
// @access  Private
const getDashboardStats = async (req, res) => {
  try {
    const { month, year } = req.query;
    const currentMonth = month || moment().month() + 1;
    const currentYear = year || moment().year();

    // Calculate start and end dates for the month
    const startDate = moment([currentYear, currentMonth - 1]).startOf('month');
    const endDate = moment([currentYear, currentMonth - 1]).endOf('month');

    const filter = {
      user: req.user.id,
      date: {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      },
    };

    const transactions = await Transaction.find(filter);

    // Calculate totals
    const totalIncome = transactions
      .filter((t) => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    // Category-wise expenses
    const categoryExpenses = {};
    transactions
      .filter((t) => t.type === 'expense')
      .forEach((t) => {
        categoryExpenses[t.category] =
          (categoryExpenses[t.category] || 0) + t.amount;
      });

    // Monthly summary (last 6 months)
    const sixMonthsAgo = moment().subtract(6, 'months');
    const monthlyFilter = {
      user: req.user.id,
      date: { $gte: sixMonthsAgo.toDate() },
      type: 'expense',
    };

    const monthlyData = await Transaction.aggregate([
      { $match: monthlyFilter },
      {
        $group: {
          _id: {
            month: { $month: '$date' },
            year: { $year: '$date' },
          },
          total: { $sum: '$amount' },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    res.json({
      totalIncome,
      totalExpenses,
      balance,
      categoryExpenses,
      monthlyData: monthlyData.map((item) => ({
        month: item._id.month,
        year: item._id.year,
        total: item.total,
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Helper function to check budget alerts
const checkBudgetAlert = async (userId, date, expenseAmount) => {
  try {
    const month = moment(date).month() + 1;
    const year = moment(date).year();

    const budget = await Budget.findOne({ user: userId, month, year });
    if (!budget) return;

    // Get total expenses for the month
    const startDate = moment([year, month - 1]).startOf('month');
    const endDate = moment([year, month - 1]).endOf('month');

    const totalExpenses = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'expense',
          date: { $gte: startDate.toDate(), $lte: endDate.toDate() },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const currentTotal = totalExpenses[0]?.total || 0;

    // Check if exceeds budget
    if (currentTotal > budget.amount) {
      // Here you would typically send an email or notification
      console.log(`Budget exceeded for ${month}/${year}`);
    }
  } catch (error) {
    console.error('Budget alert error:', error);
  }
};

module.exports = {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getDashboardStats,
};