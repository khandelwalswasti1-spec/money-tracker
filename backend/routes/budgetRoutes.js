const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getCurrentBudget,
  setBudget,
  getBudgetHistory,
} = require('../controllers/budgetController');

router.use(protect);

router.get('/current', getCurrentBudget);
router.post('/', setBudget);
router.get('/history', getBudgetHistory);

module.exports = router;