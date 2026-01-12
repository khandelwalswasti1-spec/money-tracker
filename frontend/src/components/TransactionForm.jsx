import React, { useState } from 'react';
import axios from 'axios';

const TransactionForm = ({ onTransactionAdded, editingTransaction }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  
  const [formData, setFormData] = useState({
    title: editingTransaction?.title || '',
    amount: editingTransaction?.amount || '',
    type: editingTransaction?.type || 'expense',
    category: editingTransaction?.category || 'Food',
    date: editingTransaction?.date ? new Date(editingTransaction.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    notes: editingTransaction?.notes || '',
  });

  const categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Health', 'Others'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTransaction) {
        await axios.put(`${API_URL}/transactions/${editingTransaction._id}`, formData);
      } else {
        await axios.post(`${API_URL}/transactions`, formData);
      }
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
      onTransactionAdded();
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="transaction-form">
      <div className="form-row">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group">
          <label>Amount *</label>
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

      <div className="form-row">
        <div className="form-group">
          <label>Type *</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Category *</label>
          <select name="category" value={formData.category} onChange={handleChange}>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group">
        <label>Notes</label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          maxLength="200"
          rows="3"
        />
      </div>

      <button type="submit" className="btn-primary">
        {editingTransaction ? 'Update' : 'Add'} Transaction
      </button>
    </form>
  );
};

export default TransactionForm;