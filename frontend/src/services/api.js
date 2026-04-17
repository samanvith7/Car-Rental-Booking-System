import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token if present
const token = localStorage.getItem('token');
if (token) api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

// Response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      delete api.defaults.headers.common['Authorization'];
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Cars
export const getCars = (params) => api.get('/cars', { params });
export const getCar = (id) => api.get(`/cars/${id}`);
export const getFeaturedCars = () => api.get('/cars/featured');
export const createCar = (data) => api.post('/cars', data);
export const updateCar = (id, data) => api.put(`/cars/${id}`, data);
export const deleteCar = (id) => api.delete(`/cars/${id}`);

// Bookings
export const createBooking = (data) => api.post('/bookings', data);
export const getUserBookings = () => api.get('/bookings/my');
export const getBooking = (id) => api.get(`/bookings/${id}`);
export const cancelBooking = (id, reason) => api.put(`/bookings/${id}/cancel`, { reason });
export const getAllBookings = () => api.get('/bookings/all');
export const updateBookingStatus = (id, status) => api.put(`/bookings/${id}/status`, { status });

// Payments
export const createPaymentIntent = (bookingId) => api.post('/payments/create-intent', { bookingId });
export const confirmPayment = (paymentId, transactionId) => api.post('/payments/confirm', { paymentId, transactionId });
export const mockPayment = (bookingId) => api.post('/payments/mock', { bookingId });

// Reviews
export const getCarReviews = (carId) => api.get(`/reviews/car/${carId}`);
export const createReview = (data) => api.post('/reviews', data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`);

// Admin
export const getDashboardStats = () => api.get('/admin/stats');
export const getAllUsers = () => api.get('/admin/users');
export const deleteUser = (id) => api.delete(`/admin/users/${id}`);
export const toggleUserStatus = (id) => api.put(`/admin/users/${id}/toggle`);
