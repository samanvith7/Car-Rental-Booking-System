const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

dotenv.config({ path: '../.env' });

const User = require('../models/User');
const Car = require('../models/Car');
const Booking = require('../models/Booking');
const Review = require('../models/Review');
const Payment = require('../models/Payment');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/carrental';

const users = [
  {
    name: 'Admin User',
    email: 'admin@carrental.com',
    password: 'admin123',
    role: 'admin',
    phone: '+1-555-000-0001',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=1a1a2e&color=fff',
  },
  {
    name: 'John Smith',
    email: 'john@example.com',
    password: 'user123',
    role: 'user',
    phone: '+1-555-100-0001',
    avatar: 'https://ui-avatars.com/api/?name=John+Smith&background=e94560&color=fff',
    address: { street: '123 Main St', city: 'New York', state: 'NY', country: 'USA' },
  },
  {
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    password: 'user123',
    role: 'user',
    phone: '+1-555-100-0002',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=533483&color=fff',
    address: { street: '456 Oak Ave', city: 'Los Angeles', state: 'CA', country: 'USA' },
  },
  {
    name: 'Mike Davis',
    email: 'mike@example.com',
    password: 'user123',
    role: 'user',
    phone: '+1-555-100-0003',
    avatar: 'https://ui-avatars.com/api/?name=Mike+Davis&background=2b9348&color=fff',
  },
];

const cars = [
  {
    name: 'Tesla Model S',
    brand: 'Tesla',
    model: 'Model S',
    year: 2023,
    category: 'Luxury',
    type: 'Sedan',
    pricePerDay: 150,
    images: [
      'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800',
      'https://images.unsplash.com/photo-1561580125-028ee3bd62eb?w=800',
      'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800',
    ],
    features: ['Autopilot', 'Premium Sound', 'Panoramic Roof', 'Fast Charging', 'Premium Interior', 'Over-the-air Updates'],
    specs: { fuelType: 'Electric', transmission: 'Automatic', seats: 5, mileage: '405 mi range', engine: 'Dual Motor AWD', horsepower: 670, acceleration: '0-60 in 3.1s', topSpeed: '155 mph' },
    location: 'New York',
    description: 'Experience the future of driving with the Tesla Model S. Unmatched performance, range, and technology in one stunning package.',
    registrationNumber: 'NY-TES-001',
    color: 'Pearl White',
    availability: true,
    rating: 4.8,
    numReviews: 24,
  },
  {
    name: 'BMW M5 Competition',
    brand: 'BMW',
    model: 'M5',
    year: 2023,
    category: 'Luxury',
    type: 'Sedan',
    pricePerDay: 200,
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      'https://images.unsplash.com/photo-1523983388277-336a66bf9bcd?w=800',
      'https://images.unsplash.com/photo-1541447271487-09612b3f49f7?w=800',
    ],
    features: ['M Sport Package', 'Adaptive Suspension', 'Head-Up Display', 'Surround Camera', 'Premium Audio', 'Heated Seats'],
    specs: { fuelType: 'Petrol', transmission: 'Automatic', seats: 5, mileage: '18 mpg', engine: '4.4L V8 Twin-Turbo', horsepower: 617, acceleration: '0-60 in 3.1s', topSpeed: '190 mph' },
    location: 'Los Angeles',
    description: 'The BMW M5 Competition is the ultimate expression of sports sedan performance. Raw power meets daily usability.',
    registrationNumber: 'CA-BMW-002',
    color: 'Carbon Black',
    availability: true,
    rating: 4.9,
    numReviews: 18,
  },
  {
    name: 'Toyota RAV4 Adventure',
    brand: 'Toyota',
    model: 'RAV4',
    year: 2023,
    category: 'SUV',
    type: 'SUV',
    pricePerDay: 85,
    images: [
      'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
    ],
    features: ['AWD', 'Apple CarPlay', 'Android Auto', 'Lane Departure Alert', 'Adaptive Cruise Control', 'Roof Rails'],
    specs: { fuelType: 'Petrol', transmission: 'Automatic', seats: 5, mileage: '30 mpg', engine: '2.5L 4-Cylinder', horsepower: 203, acceleration: '0-60 in 7.8s', topSpeed: '120 mph' },
    location: 'Chicago',
    description: 'Perfect for adventures near and far. The RAV4 Adventure combines capability with everyday comfort.',
    registrationNumber: 'IL-TOY-003',
    color: 'Lunar Rock',
    availability: true,
    rating: 4.5,
    numReviews: 32,
  },
  {
    name: 'Mercedes-Benz GLE 450',
    brand: 'Mercedes-Benz',
    model: 'GLE 450',
    year: 2023,
    category: 'Luxury',
    type: 'SUV',
    pricePerDay: 220,
    images: [
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
      'https://images.unsplash.com/photo-1617469767053-8d6b79b8a24f?w=800',
    ],
    features: ['MBUX System', 'Burmester Sound', 'Air Suspension', 'Night Vision', 'Massaging Seats', 'Panoramic Sunroof'],
    specs: { fuelType: 'Petrol', transmission: 'Automatic', seats: 7, mileage: '22 mpg', engine: '3.0L Inline-6 Turbo', horsepower: 362, acceleration: '0-60 in 5.5s', topSpeed: '155 mph' },
    location: 'Miami',
    description: 'Commanding presence with first-class luxury. The GLE 450 redefines what a premium SUV can be.',
    registrationNumber: 'FL-MBZ-004',
    color: 'Obsidian Black',
    availability: true,
    rating: 4.7,
    numReviews: 15,
  },
  {
    name: 'Honda Civic Sport',
    brand: 'Honda',
    model: 'Civic',
    year: 2023,
    category: 'Economy',
    type: 'Sedan',
    pricePerDay: 45,
    images: [
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
      'https://images.unsplash.com/photo-1621993202258-7d97ee2cefd0?w=800',
      'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800',
    ],
    features: ['Honda Sensing', 'Apple CarPlay', 'Android Auto', 'Rear Camera', 'Keyless Entry', 'LED Headlights'],
    specs: { fuelType: 'Petrol', transmission: 'Automatic', seats: 5, mileage: '36 mpg', engine: '1.5L Turbo', horsepower: 158, acceleration: '0-60 in 7.8s', topSpeed: '130 mph' },
    location: 'Houston',
    description: 'Reliable, fuel-efficient and fun to drive. The Honda Civic Sport is perfect for city driving and long trips alike.',
    registrationNumber: 'TX-HON-005',
    color: 'Sonic Gray Pearl',
    availability: true,
    rating: 4.3,
    numReviews: 45,
  },
  {
    name: 'Porsche Cayenne Turbo',
    brand: 'Porsche',
    model: 'Cayenne',
    year: 2023,
    category: 'Luxury',
    type: 'SUV',
    pricePerDay: 300,
    images: [
      'https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?w=800',
      'https://images.unsplash.com/photo-1619551734325-81176b395d44?w=800',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
    ],
    features: ['Sport Chrono', 'PDCC Sport', 'Night Vision', 'Bose Surround Sound', 'Air Suspension', 'Rear-Axle Steering'],
    specs: { fuelType: 'Petrol', transmission: 'Automatic', seats: 5, mileage: '17 mpg', engine: '4.0L V8 Twin-Turbo', horsepower: 541, acceleration: '0-60 in 3.7s', topSpeed: '177 mph' },
    location: 'San Francisco',
    description: 'The Porsche Cayenne Turbo delivers supercar performance wrapped in a practical SUV package. Breathtaking from every angle.',
    registrationNumber: 'CA-POR-006',
    color: 'Carrara White',
    availability: true,
    rating: 4.9,
    numReviews: 12,
  },
  {
    name: 'Ford Mustang GT',
    brand: 'Ford',
    model: 'Mustang GT',
    year: 2023,
    category: 'Premium',
    type: 'Convertible',
    pricePerDay: 120,
    images: [
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
      'https://images.unsplash.com/photo-1608379743498-20ba8fb3bf45?w=800',
      'https://images.unsplash.com/photo-1547744152-14d985cb937f?w=800',
    ],
    features: ['V8 Engine', 'Launch Control', 'Track Apps', 'B&O Sound', 'Active Exhaust', 'Performance Package'],
    specs: { fuelType: 'Petrol', transmission: 'Manual', seats: 4, mileage: '20 mpg', engine: '5.0L V8', horsepower: 450, acceleration: '0-60 in 4.6s', topSpeed: '155 mph' },
    location: 'Las Vegas',
    description: 'America\'s most iconic sports car. The Mustang GT delivers raw V8 power with a heritage that spans generations.',
    registrationNumber: 'NV-FOR-007',
    color: 'Race Red',
    availability: true,
    rating: 4.6,
    numReviews: 28,
  },
  {
    name: 'Toyota Camry Hybrid',
    brand: 'Toyota',
    model: 'Camry',
    year: 2023,
    category: 'Economy',
    type: 'Sedan',
    pricePerDay: 55,
    images: [
      'https://images.unsplash.com/photo-1621993202258-7d97ee2cefd0?w=800',
      'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800',
      'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=800',
    ],
    features: ['Hybrid System', 'Toyota Safety Sense', 'Apple CarPlay', 'Android Auto', 'Wireless Charging', 'JBL Audio'],
    specs: { fuelType: 'Hybrid', transmission: 'Automatic', seats: 5, mileage: '52 mpg', engine: '2.5L Hybrid', horsepower: 208, acceleration: '0-60 in 7.1s', topSpeed: '115 mph' },
    location: 'Seattle',
    description: 'Exceptional fuel economy without sacrificing comfort or style. The Camry Hybrid is the smart choice for eco-conscious drivers.',
    registrationNumber: 'WA-TOY-008',
    color: 'Midnight Black',
    availability: true,
    rating: 4.4,
    numReviews: 38,
  },
  {
    name: 'Audi Q7 Prestige',
    brand: 'Audi',
    model: 'Q7',
    year: 2023,
    category: 'Luxury',
    type: 'SUV',
    pricePerDay: 180,
    images: [
      'https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=800',
      'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800',
      'https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=800',
    ],
    features: ['Quattro AWD', 'Virtual Cockpit', 'Bang & Olufsen', 'Matrix LED', 'Air Suspension', 'Massage Seats'],
    specs: { fuelType: 'Diesel', transmission: 'Automatic', seats: 7, mileage: '25 mpg', engine: '3.0L TDI V6', horsepower: 335, acceleration: '0-60 in 5.7s', topSpeed: '155 mph' },
    location: 'Boston',
    description: 'Seven seats of premium German engineering. The Q7 Prestige offers unparalleled luxury with everyday versatility.',
    registrationNumber: 'MA-AUD-009',
    color: 'Glacier White',
    availability: true,
    rating: 4.7,
    numReviews: 20,
  },
  {
    name: 'Jeep Wrangler Rubicon',
    brand: 'Jeep',
    model: 'Wrangler',
    year: 2023,
    category: 'SUV',
    type: 'SUV',
    pricePerDay: 110,
    images: [
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
      'https://images.unsplash.com/photo-1568844293986-8d0400bd4745?w=800',
    ],
    features: ['4x4 System', 'Rock-Trac Transfer Case', 'Removable Doors', 'Fold-Down Windshield', 'Off-Road Tires', 'Skid Plates'],
    specs: { fuelType: 'Petrol', transmission: 'Manual', seats: 5, mileage: '20 mpg', engine: '3.6L Pentastar V6', horsepower: 285, acceleration: '0-60 in 7.9s', topSpeed: '99 mph' },
    location: 'Denver',
    description: 'Built for those who dare to go beyond the pavement. The Wrangler Rubicon is the ultimate off-road machine.',
    registrationNumber: 'CO-JEP-010',
    color: 'Firecracker Red',
    availability: true,
    rating: 4.5,
    numReviews: 22,
  },
  {
    name: 'Volkswagen Golf GTI',
    brand: 'Volkswagen',
    model: 'Golf GTI',
    year: 2023,
    category: 'Hatchback',
    type: 'Hatchback',
    pricePerDay: 65,
    images: [
      'https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=800',
      'https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?w=800',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800',
    ],
    features: ['Sport Suspension', 'Dynaudio Sound', 'Digital Cockpit', 'Park Assist', 'Adaptive Cruise', 'Heated Seats'],
    specs: { fuelType: 'Petrol', transmission: 'Manual', seats: 5, mileage: '29 mpg', engine: '2.0L TSI Turbo', horsepower: 241, acceleration: '0-60 in 6.3s', topSpeed: '155 mph' },
    location: 'Austin',
    description: 'The benchmark hot hatch. The GTI delivers thrilling performance in a practical, everyday package.',
    registrationNumber: 'TX-VW-011',
    color: 'Kings Red',
    availability: true,
    rating: 4.6,
    numReviews: 31,
  },
  {
    name: 'Chevrolet Tahoe Premier',
    brand: 'Chevrolet',
    model: 'Tahoe',
    year: 2023,
    category: 'SUV',
    type: 'SUV',
    pricePerDay: 140,
    images: [
      'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800',
      'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    ],
    features: ['3-Zone Climate', 'Bose Audio', 'Wireless Charging', 'Super Cruise', 'Rear Entertainment', 'Power Running Boards'],
    specs: { fuelType: 'Petrol', transmission: 'Automatic', seats: 8, mileage: '21 mpg', engine: '5.3L EcoTec3 V8', horsepower: 355, acceleration: '0-60 in 6.7s', topSpeed: '115 mph' },
    location: 'Dallas',
    description: 'Family-size capability with full-size luxury. The Tahoe Premier seats 8 in comfort with power to spare.',
    registrationNumber: 'TX-CHV-012',
    color: 'Iridescent Pearl',
    availability: false,
    rating: 4.3,
    numReviews: 17,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Car.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    await Payment.deleteMany({});
    console.log('Existing data cleared.');

    // Create users (passwords hashed by pre-save hook)
    const createdUsers = await User.create(users);
    console.log(`${createdUsers.length} users created.`);

    // Create cars
    const createdCars = await Car.create(cars);
    console.log(`${createdCars.length} cars created.`);

    const userJohn = createdUsers.find(u => u.email === 'john@example.com');
    const userSarah = createdUsers.find(u => u.email === 'sarah@example.com');
    const userMike = createdUsers.find(u => u.email === 'mike@example.com');

    // Create sample bookings
    const booking1 = await Booking.create({
      user: userJohn._id,
      car: createdCars[0]._id, // Tesla
      pickupDate: new Date('2025-02-10'),
      dropoffDate: new Date('2025-02-13'),
      pickupLocation: 'New York JFK Airport',
      dropoffLocation: 'New York Manhattan',
      totalDays: 3,
      pricePerDay: 150,
      totalAmount: 450,
      status: 'completed',
      paymentStatus: 'paid',
    });

    const booking2 = await Booking.create({
      user: userSarah._id,
      car: createdCars[2]._id, // RAV4
      pickupDate: new Date('2025-03-05'),
      dropoffDate: new Date('2025-03-08'),
      pickupLocation: 'Chicago O\'Hare Airport',
      dropoffLocation: 'Chicago Downtown',
      totalDays: 3,
      pricePerDay: 85,
      totalAmount: 255,
      status: 'completed',
      paymentStatus: 'paid',
    });

    const booking3 = await Booking.create({
      user: userJohn._id,
      car: createdCars[4]._id, // Civic
      pickupDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      dropoffDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
      pickupLocation: 'Houston George Bush Airport',
      dropoffLocation: 'Houston Downtown',
      totalDays: 3,
      pricePerDay: 45,
      totalAmount: 135,
      status: 'confirmed',
      paymentStatus: 'paid',
    });

    // Create payments for completed bookings
    await Payment.create({
      booking: booking1._id,
      user: userJohn._id,
      amount: 450,
      status: 'succeeded',
      method: 'mock',
      transactionId: 'mock_txn_seed_001',
    });

    await Payment.create({
      booking: booking2._id,
      user: userSarah._id,
      amount: 255,
      status: 'succeeded',
      method: 'mock',
      transactionId: 'mock_txn_seed_002',
    });

    await Payment.create({
      booking: booking3._id,
      user: userJohn._id,
      amount: 135,
      status: 'succeeded',
      method: 'mock',
      transactionId: 'mock_txn_seed_003',
    });

    // Create reviews
    await Review.create({
      user: userJohn._id,
      car: createdCars[0]._id,
      booking: booking1._id,
      rating: 5,
      title: 'Absolutely incredible experience!',
      comment: 'The Tesla Model S exceeded all my expectations. Autopilot made highway driving effortless, and the range was more than enough. Will definitely rent again!',
    });

    await Review.create({
      user: userSarah._id,
      car: createdCars[2]._id,
      booking: booking2._id,
      rating: 4,
      title: 'Great family SUV',
      comment: 'Perfect for our family road trip. Plenty of space, comfortable seats, and great fuel economy. Apple CarPlay worked flawlessly. Highly recommended!',
    });

    await Review.create({
      user: userMike._id,
      car: createdCars[1]._id,
      rating: 5,
      title: 'Pure driving perfection',
      comment: 'The BMW M5 is an absolute beast. 617 horsepower delivered so smoothly. Comfort mode for the commute, sport+ for weekend blasts. Best car I\'ve ever driven.',
    });

    // Add wishlists
    userJohn.wishlist = [createdCars[1]._id, createdCars[5]._id];
    await userJohn.save();
    userSarah.wishlist = [createdCars[3]._id, createdCars[8]._id];
    await userSarah.save();

    console.log('\n✅ Database seeded successfully!');
    console.log('\n📋 Demo Accounts:');
    console.log('  Admin:  admin@carrental.com  / admin123');
    console.log('  User 1: john@example.com     / user123');
    console.log('  User 2: sarah@example.com    / user123');
    console.log('  User 3: mike@example.com     / user123');
    console.log('\n🚗 Cars created:', createdCars.length);
    console.log('📅 Bookings created: 3');
    console.log('⭐ Reviews created: 3');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
