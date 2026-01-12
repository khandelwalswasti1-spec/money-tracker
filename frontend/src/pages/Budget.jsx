import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaCalendar, FaMoneyBillWave } from 'react-icons/fa';

const Budget = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [budget, setBudget] = useState({ amount: 0 });
  const [history, setHistory] = useState([]);
  const [formData, setFormData] = useState({
    amount: '',
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgetData();
  }, []);

  const fetchBudgetData = async () => {
    try {
      const [currentRes, historyRes] = await Promise.all([
        axios.get(`${API_URL}/budget/current`),
        axios.get(`${API_URL}/budget/history`),
      ]);
      
      setBudget(currentRes.data);
      setHistory(historyRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching budget data:', error);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/budget`, formData);
      fetchBudgetData();
      setFormData({
        amount: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
      });
    } catch (error) {
      console.error('Error setting budget:', error);
    }
  };

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="container">
      <h1>Budget Management</h1>
      
      {/* Current Budget */}
      <div className="card">
        <h2>
          <FaMoneyBillWave /> Current Monthly Budget
        </h2>
        <div className="stat-card budget">
          <div className="amount">${budget.amount.toFixed(2)}</div>
          <p className="text-center">
            Budget for {months[new Date().getMonth()]} {new Date().getFullYear()}
          </p>
        </div>
      </div>

      {/* Set Budget Form */}
      <div className="card budget-form">
        <h2>Set New Budget</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Month</label>
              <select
                name="month"
                value={formData.month}
                onChange={handleChange}
              >
                {months.map((month, index) => (
                  <option key={month} value={index + 1}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label>Year</label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleChange}
                min="2000"
                max="2100"
              />
            </div>
            
            <div className="form-group">
              <label>Budget Amount ($)</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          
          <button type="submit" className="btn-primary">
            Set Budget
          </button>
        </form>
      </div>

      {/* Budget History */}
      <div className="card budget-history">
        <h2>Budget History</h2>
        {history.length === 0 ? (
          <p>No budget history available</p>
        ) : (
          <div className="history-list">
            {history.map((item) => (
              <div key={item._id} className="budget-item">
                <div className="budget-info">
                  <div className="budget-period">
                    <FaCalendar /> {months[item.month - 1]} {item.year}
                  </div>
                </div>
                <div className="budget-amount">
                  ${item.amount.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Budget;