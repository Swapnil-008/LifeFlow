const mongoose = require('mongoose');

const EXPENSE_CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Education', 'Entertainment', 'Health', 'Other'];
const PAYMENT_METHODS = ['Cash', 'UPI', 'Card', 'Other'];

const expenseSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: [0.01, 'Amount must be greater than 0'],
    },
    category: {
      type: String,
      enum: EXPENSE_CATEGORIES,
      default: 'Other',
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: [200, 'Description cannot exceed 200 characters'],
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      default: 'Cash',
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

// Frequent query: "this user's expenses in a date range" (today / this week / this month)
expenseSchema.index({ userId: 1, date: 1 });
// Frequent query: "this user's expenses by category" (category breakdown chart)
expenseSchema.index({ userId: 1, category: 1 });

module.exports = mongoose.model('Expense', expenseSchema);
module.exports.EXPENSE_CATEGORIES = EXPENSE_CATEGORIES;
module.exports.PAYMENT_METHODS = PAYMENT_METHODS;
