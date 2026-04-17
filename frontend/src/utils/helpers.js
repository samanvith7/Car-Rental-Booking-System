import { format, differenceInDays, parseISO } from 'date-fns';

export const formatDate = (date) => {
  if (!date) return '';
  return format(new Date(date), 'MMM dd, yyyy');
};

export const formatDateInput = (date) => {
  if (!date) return '';
  return format(new Date(date), 'yyyy-MM-dd');
};

export const calcDays = (start, end) => {
  if (!start || !end) return 0;
  const days = differenceInDays(new Date(end), new Date(start));
  return days < 1 ? 1 : days;
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

export const getStatusColor = (status) => {
  const map = {
    pending: 'warning', confirmed: 'info', active: 'success',
    completed: 'secondary', cancelled: 'danger',
  };
  return map[status] || 'secondary';
};

export const getPaymentStatusColor = (status) => {
  const map = { pending: 'warning', paid: 'success', refunded: 'info', failed: 'danger' };
  return map[status] || 'secondary';
};

export const truncate = (str, n = 100) => str?.length > n ? str.substr(0, n - 1) + '...' : str;

export const getStarArray = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(i <= Math.floor(rating) ? 'full' : i - 0.5 <= rating ? 'half' : 'empty');
  }
  return stars;
};

export const buildQueryString = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => { if (v !== '' && v !== null && v !== undefined) query.append(k, v); });
  return query.toString();
};
