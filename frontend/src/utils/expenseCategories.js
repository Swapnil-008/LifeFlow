export const EXPENSE_CATEGORIES = ['Food', 'Travel', 'Shopping', 'Bills', 'Education', 'Entertainment', 'Health', 'Other'];

export const PAYMENT_METHODS = ['Cash', 'UPI', 'Card', 'Other'];

// One muted hue per category — shared by the category badge dots and the
// Recharts pie/bar charts so the same category always reads as the same
// color everywhere in the app.
export const CATEGORY_COLORS = {
  Food: '#C1493E',
  Travel: '#3E7CA6',
  Shopping: '#C98A2C',
  Bills: '#6B7280',
  Education: '#1F6F5C',
  Entertainment: '#8B5FA6',
  Health: '#7A8C3E',
  Other: '#B85C7A',
};

export const categoryColor = (category) => CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
