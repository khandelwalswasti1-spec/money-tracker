const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getTransactions,
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getDashboardStats,
} = require('../controllers/transactionController');

// All routes require authentication
router.use(protect);

router.route('/')
  .get(getTransactions)
  .post(addTransaction);

router.route('/:id')
  .put(updateTransaction)
  .delete(deleteTransaction);

router.get('/dashboard/stats', getDashboardStats);

module.exports = router;