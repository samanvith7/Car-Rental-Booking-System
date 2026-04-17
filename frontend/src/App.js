import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import Loader from './components/common/Loader';

// Pages
import Home from './pages/Home';
import CarsPage from './pages/CarsPage';
import CarDetailPage from './pages/CarDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import UserDashboard from './pages/UserDashboard';
import WishlistPage from './pages/WishlistPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCars from './pages/admin/AdminCars';
import AdminUsers from './pages/admin/AdminUsers';
import AdminBookings from './pages/admin/AdminBookings';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  const { loading } = useAuth();
  if (loading) return <Loader fullScreen />;

  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cars" element={<CarsPage />} />
            <Route path="/cars/:id" element={<CarDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes */}
            <Route path="/booking/:carId" element={<ProtectedRoute><BookingPage /></ProtectedRoute>} />
            <Route path="/payment/:bookingId" element={<ProtectedRoute><PaymentPage /></ProtectedRoute>} />
            <Route path="/payment/success" element={<ProtectedRoute><PaymentSuccessPage /></ProtectedRoute>} />
            <Route path="/payment/failure" element={<ProtectedRoute><PaymentFailurePage /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/cars" element={<AdminRoute><AdminCars /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
