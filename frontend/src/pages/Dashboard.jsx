import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ExpenseChart from '../components/ExpenseChart';
import TransactionForm from '../components/TransactionForm';
import { FaArrowUp, FaArrowDown, FaWallet } from 'react-icons/fa';

const Dashboard = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    balance: 0,
    categoryExpenses: {},
    monthlyData: [],
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [budget, setBudget] = useState({ amount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, transactionsRes, budgetRes] = await Promise.all([
        axios.get(`${API_URL}/transactions/dashboard/stats`),
        axios.get(`${API_URL}/transactions?limit=5`),
        axios.get(`${API_URL}/budget/current`),
      ]);

      setStats(statsRes.data);
      setRecentTransactions(transactionsRes.data);
      setBudget(budgetRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleTransactionAdded = () => {
    fetchDashboardData();
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="stats-container">
        <div className="stat-card income">
          <div className="card-header">
            <FaArrowUp className="icon" />
            <h3>Total Income</h3>
          </div>
          <div className="amount">${stats.totalIncome.toFixed(2)}</div>
        </div>
        
        <div className="stat-card expense">
          <div className="card-header">
            <FaArrowDown className="icon" />
            <h3>Total Expenses</h3>
          </div>
          <div className="amount">${stats.totalExpenses.toFixed(2)}</div>
        </div>
        
        <div className="stat-card balance">
          <div className="card-header">
            <FaWallet className="icon" />
            <h3>Balance</h3>
          </div>
          <div className="amount">${stats.balance.toFixed(2)}</div>
        </div>
        
        <div className="stat-card budget">
          <div className="card-header">
            <h3>Monthly Budget</h3>
          </div>
          <div className="amount">${budget.amount.toFixed(2)}</div>
          <div className="progress">
            {budget.amount > 0 && (
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${Math.min((stats.totalExpenses / budget.amount) * 100, 100)}%` }}
                ></div>
              </div>
            )}
            <small>
              Spent: ${stats.totalExpenses.toFixed(2)} of ${budget.amount.toFixed(2)}
            </small>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        {/* Add Transaction Form */}
        <div className="card">
          <h2>Add New Transaction</h2>
          <TransactionForm onTransactionAdded={handleTransactionAdded} />
        </div>

        {/* Expense Chart */}
        <div className="card">
          <ExpenseChart categoryExpenses={stats.categoryExpenses} />
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h2>Recent Transactions</h2>
          {recentTransactions.length === 0 ? (
            <p>No transactions yet</p>
          ) : (
            <div className="transaction-list">
              {recentTransactions.map((transaction) => (
                <div 
                  key={transaction._id} 
                  className={`transaction-item ${transaction.type}`}
                >
                  <div className="transaction-info">
                    <div className="transaction-title">{transaction.title}</div>
                    <div className="transaction-category">{transaction.category}</div>
                    <div className="transaction-date">
                      {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="transaction-amount">
                    <span className={`amount ${transaction.type}`}>
                      {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;