import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TransactionForm from '../components/TransactionForm';
import { FaEdit, FaTrash } from 'react-icons/fa';

const Transactions = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    category: '',
    type: '',
  });

  useEffect(() => {
    fetchTransactions();
  }, [filters]);

  const fetchTransactions = async () => {
    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const res = await axios.get(`${API_URL}/transactions?${queryParams}`);
      setTransactions(res.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await axios.delete(`${API_URL}/transactions/${id}`);
        fetchTransactions();
      } catch (error) {
        console.error('Error deleting transaction:', error);
      }
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      category: '',
      type: '',
    });
  };

  const categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Health', 'Others'];

  return (
    <div className="container">
      <h1>Transactions</h1>
      
      {/* Filter Section */}
      <div className="filters card">
        <h3>Filters</h3>
        <div className="filter-grid">
          <div className="form-group">
            <label>Start Date</label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label>End Date</label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
            />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
        </div>
        <button onClick={clearFilters} className="btn-secondary">
          Clear Filters
        </button>
      </div>

      {/* Add/Edit Transaction Form */}
      <div className="card">
        <h2>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h2>
        <TransactionForm 
          onTransactionAdded={() => {
            fetchTransactions();
            setEditingTransaction(null);
          }}
          editingTransaction={editingTransaction}
        />
        {editingTransaction && (
          <button 
            onClick={() => setEditingTransaction(null)}
            className="btn-secondary"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {/* Transactions List */}
      <div className="card">
        <h2>Transaction History</h2>
        {transactions.length === 0 ? (
          <p>No transactions found</p>
        ) : (
          <div className="transactions-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction) => (
                  <tr key={transaction._id}>
                    <td>{new Date(transaction.date).toLocaleDateString()}</td>
                    <td>{transaction.title}</td>
                    <td>{transaction.category}</td>
                    <td>
                      <span className={`badge ${transaction.type}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className={transaction.type}>
                      ${transaction.amount.toFixed(2)}
                    </td>
                    <td className="actions">
                      <button
                        onClick={() => setEditingTransaction(transaction)}
                        className="btn-icon"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(transaction._id)}
                        className="btn-icon delete"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;