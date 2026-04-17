# 🚗 DriveElite — Premium Car Rental App (MERN Stack)

A fully functional, production-ready car rental web application built with the MERN stack (MongoDB, Express, React, Node.js).

---

## ✨ Features

### 👤 User Features
- Register & Login with JWT authentication
- Browse & search cars (by location, price, category, fuel type, transmission)
- View detailed car pages with images, specs, and reviews
- Wishlist — add/remove cars
- Book a car (with conflict checking for dates)
- Mock payment gateway (Stripe-ready)
- View booking history & cancel bookings
- Write reviews & ratings for rented cars
- Profile management

### 🛡️ Admin Features
- Admin dashboard with analytics & charts (revenue, bookings by category)
- Full car CRUD (add, edit, delete with image URLs & specs)
- User management (view all, toggle active status, delete)
- Booking management (view all, update status)

### 🔧 Technical Highlights
- JWT-based authentication with protected routes
- Role-based access control (user / admin)
- Double-booking prevention logic
- Stripe test mode + mock payment fallback
- Responsive dark-themed UI with Syne + Inter fonts
- RESTful API with clean MVC architecture
- Mongoose schemas with relationships
- Database seeder with realistic sample data

---

## 🗂 Project Structure

```
carrental/
├── backend/
│   ├── config/          # Database config
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & error middleware
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── seed/            # Database seeder
│   ├── utils/           # Helper functions
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── public/
│   └── src/
│       ├── components/  # Reusable components
│       ├── context/     # Auth context
│       ├── pages/       # Page components
│       ├── services/    # API service layer
│       └── utils/       # Helper functions
└── README.md
```

---

## 🚀 Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local install or MongoDB Atlas)
- npm or yarn

---

### Step 1: Clone & Install

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

### Step 2: Configure Environment Variables

**Backend** — create `backend/.env` from `backend/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/carrental
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=30d
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
CLIENT_URL=http://localhost:3000
NODE_ENV=development
```

**Frontend** — create `frontend/.env` from `frontend/.env.example`:

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
```

> 💡 **No Stripe keys?** The app works in **mock payment mode** automatically. You can test the full payment flow without real Stripe credentials.

---

### Step 3: Seed the Database

```bash
cd backend
npm run seed
```

This creates:
- 12 sample cars (Tesla, BMW, Mercedes, Porsche, etc.)
- 4 user accounts (1 admin + 3 regular users)
- Sample bookings, reviews, and payments

**Demo accounts after seeding:**

| Role  | Email | Password |
|-------|-------|----------|
| Admin | admin@carrental.com | admin123 |
| User  | john@example.com | user123 |
| User  | sarah@example.com | user123 |
| User  | mike@example.com | user123 |

---

### Step 4: Start the Application

**Backend** (runs on port 5000):
```bash
cd backend
npm run dev
```

**Frontend** (runs on port 3000):
```bash
cd frontend
npm start
```

Open **http://localhost:3000** in your browser.

---

## 💳 Payment Testing

### Mock Mode (default — no Stripe keys required)
- Click **Pay** button → fills mock card details automatically
- Instant success/failure simulation
- Test failure: use card number `4000 0000 0000 0002`
- Test success: use card number `4242 4242 4242 4242`

### Real Stripe Mode
1. Get Stripe test keys from [dashboard.stripe.com](https://dashboard.stripe.com)
2. Set `STRIPE_SECRET_KEY` in backend `.env`
3. Set `REACT_APP_STRIPE_PUBLISHABLE_KEY` in frontend `.env`
4. Restart both servers

---

## 📡 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |

### Cars
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/cars | Get all cars (with filters) |
| GET | /api/cars/featured | Get featured cars |
| GET | /api/cars/:id | Get single car |
| POST | /api/cars | Create car (admin) |
| PUT | /api/cars/:id | Update car (admin) |
| DELETE | /api/cars/:id | Delete car (admin) |

### Bookings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/bookings | Create booking |
| GET | /api/bookings/my | Get user's bookings |
| GET | /api/bookings/all | Get all bookings (admin) |
| GET | /api/bookings/:id | Get single booking |
| PUT | /api/bookings/:id/cancel | Cancel booking |
| PUT | /api/bookings/:id/status | Update status (admin) |

### Payments
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/payments/create-intent | Create Stripe intent |
| POST | /api/payments/confirm | Confirm payment |
| POST | /api/payments/mock | Mock payment (test) |

### Reviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/reviews | Create review |
| GET | /api/reviews/car/:carId | Get car reviews |
| DELETE | /api/reviews/:id | Delete review |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/admin/stats | Dashboard analytics |
| GET | /api/admin/users | All users |
| DELETE | /api/admin/users/:id | Delete user |
| PUT | /api/admin/users/:id/toggle | Toggle user active |

---

## 🎨 UI Pages

| Page | Route | Access |
|------|-------|--------|
| Home | / | Public |
| Browse Cars | /cars | Public |
| Car Details | /cars/:id | Public |
| Login | /login | Public |
| Register | /register | Public |
| Book Car | /booking/:carId | User |
| Payment | /payment/:bookingId | User |
| Payment Success | /payment/success | User |
| Payment Failure | /payment/failure | User |
| User Dashboard | /dashboard | User |
| Wishlist | /wishlist | User |
| Admin Dashboard | /admin | Admin |
| Admin Cars | /admin/cars | Admin |
| Admin Users | /admin/users | Admin |
| Admin Bookings | /admin/bookings | Admin |
| 404 | * | Public |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6 |
| Styling | Custom CSS with CSS Variables |
| State | Context API |
| Charts | Recharts |
| Icons | React Icons (Feather) |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (jsonwebtoken) |
| Password | bcryptjs |
| Payment | Stripe + Mock gateway |
| Dev | nodemon, concurrently |

---

## 📝 License

MIT — free to use for personal and commercial projects.
