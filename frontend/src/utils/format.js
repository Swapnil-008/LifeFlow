const currencyFormatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

export const formatCurrency = (amount) => `₹${currencyFormatter.format(amount || 0)}`;
