/**
 * Seed script — creates demo users + trips for TravelEasyHai
 * Run: node scripts/seed.js
 * Requires MongoDB Atlas to be running (resume from cloud.mongodb.com if paused)
 */

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

// ── Inline schemas (mirrors actual models) ──────────────────────────────────

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ["traveler", "provider", "admin"] },
  isVerified: { type: Boolean, default: true },
  isBlocked: { type: Boolean, default: false },
  phone: String,
  profilePhoto: String,
  avgRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
}, { timestamps: true });

const TripSchema = new mongoose.Schema({
  tripname: String,
  source: String,
  destination: String,
  sourceCoords: { lat: Number, lng: Number },
  destinationCoords: { lat: Number, lng: Number },
  date: String,
  time: String,
  seats: Number,
  bookedseats: { type: Number, default: 0 },
  kilometer: Number,
  vehicle: String,
  vehicleType: String,
  meetPlace: String,
  contact: String,
  status: { type: String, default: "Active" },
  provider: mongoose.Schema.Types.ObjectId,
}, { timestamps: true });

const BookingSchema = new mongoose.Schema({
  trip: mongoose.Schema.Types.ObjectId,
  user: mongoose.Schema.Types.ObjectId,
  seatsBooked: [Number],
  ratePerKm: { type: Number, default: 8 },
  totalPrice: Number,
  status: { type: String, default: "Active" },
  paymentMethod: { type: String, default: "cash" },
  paymentStatus: { type: String, default: "pending" },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", UserSchema);
const Trip = mongoose.models.Trip || mongoose.model("Trip", TripSchema);
const Booking = mongoose.models.Booking || mongoose.model("Booking", BookingSchema);

// ── Demo credentials ─────────────────────────────────────────────────────────

const DEMO_PROVIDER = {
  name: "Dhananjay (Provider)",
  email: "dhananjay1807d+pr@gmail.com",
  password: "Travel@1234",
  role: "provider",
  phone: "9769565004",
  isVerified: true,
};

const DEMO_TRAVELER = {
  name: "Dhananjay",
  email: "dhananjay1807d@gmail.com",
  password: "Travel@1234",
  role: "traveler",
  phone: "9769565004",
  isVerified: true,
};

const ADMIN_USER = {
  name: "Dhananjay (Admin)",
  email: "dhananjay1807d+admin@gmail.com",
  password: "Travel@1234",
  role: "admin",
  phone: "9769565004",
  isVerified: true,
};

// ── Demo trips ───────────────────────────────────────────────────────────────

const TRIPS = [
  {
    name: "Delhi to Jaipur Express",
    source: "New Delhi",
    destination: "Jaipur",
    sourceCoords: { lat: 28.6139, lng: 77.209 },
    destinationCoords: { lat: 26.9124, lng: 75.7873 },
    date: getFutureDate(1),
    time: "07:00 AM",
    seats: 4,
    bookedseats: 1,
    kilometer: 268,
    vehicle: "SWIFT DZIRE",
    vehicleType: "CAR",
    meetPlace: "Kashmere Gate ISBT",
    contact: "9876543210",
    panCard: "ABCDE1234F",
    status: "Active",
  },
  {
    name: "Mumbai to Pune Quick",
    source: "Mumbai",
    destination: "Pune",
    sourceCoords: { lat: 19.076, lng: 72.8777 },
    destinationCoords: { lat: 18.5204, lng: 73.8567 },
    date: getFutureDate(2),
    time: "09:00 AM",
    seats: 3,
    bookedseats: 0,
    kilometer: 149,
    vehicle: "INNOVA CRYSTA",
    vehicleType: "SUV",
    meetPlace: "Dadar Station West",
    contact: "9876543210",
    panCard: "ABCDE1234F",
    status: "Active",
  },
  {
    name: "Bangalore to Hyderabad",
    source: "Bangalore",
    destination: "Hyderabad",
    sourceCoords: { lat: 12.9716, lng: 77.5946 },
    destinationCoords: { lat: 17.385, lng: 78.4867 },
    date: getFutureDate(3),
    time: "06:30 AM",
    seats: 4,
    bookedseats: 2,
    kilometer: 574,
    vehicle: "ERTIGA",
    vehicleType: "VAN",
    meetPlace: "Majestic Bus Stand",
    contact: "9876543210",
    panCard: "ABCDE1234F",
    status: "Active",
  },
  {
    name: "Delhi to Agra Day Trip",
    source: "New Delhi",
    destination: "Agra",
    sourceCoords: { lat: 28.6139, lng: 77.209 },
    destinationCoords: { lat: 27.1767, lng: 78.0081 },
    date: getFutureDate(0),
    time: "05:00 AM",
    seats: 6,
    bookedseats: 3,
    kilometer: 233,
    vehicle: "TEMPO TRAVELLER",
    vehicleType: "BUS",
    meetPlace: "India Gate",
    contact: "9876543210",
    panCard: "ABCDE1234F",
    status: "Active",
  },
  {
    name: "Chandigarh to Manali",
    source: "Chandigarh",
    destination: "Manali",
    sourceCoords: { lat: 30.7333, lng: 76.7794 },
    destinationCoords: { lat: 32.2396, lng: 77.1887 },
    date: getFutureDate(5),
    time: "04:00 AM",
    seats: 5,
    bookedseats: 1,
    kilometer: 310,
    vehicle: "FORTUNER",
    vehicleType: "SUV",
    meetPlace: "Sector 17 Bus Stand",
    contact: "9876543210",
    panCard: "ABCDE1234F",
    status: "Active",
  },
  {
    name: "Delhi to Lucknow Express",
    source: "New Delhi",
    destination: "Lucknow",
    sourceCoords: { lat: 28.6139, lng: 77.209 },
    destinationCoords: { lat: 26.8467, lng: 80.9462 },
    date: getPastDate(5),
    time: "08:00 AM",
    seats: 4,
    bookedseats: 4,
    kilometer: 555,
    vehicle: "HONDA CITY",
    vehicleType: "CAR",
    meetPlace: "ISBT Kashmere Gate",
    contact: "9876543210",
    panCard: "ABCDE1234F",
    status: "Completed",
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

function getFutureDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

function getPastDate(daysAgo) {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().split("T")[0];
}

// ── Main seed ────────────────────────────────────────────────────────────────

async function seed() {
  console.log("🌱 Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Connected\n");

  // Clear existing accounts
  await User.deleteOne({ email: DEMO_PROVIDER.email });
  await User.deleteOne({ email: DEMO_TRAVELER.email });
  await User.deleteOne({ email: ADMIN_USER.email });

  // Create traveler
  const travelerHash = await bcrypt.hash(DEMO_TRAVELER.password, 10);
  const traveler = await User.create({ ...DEMO_TRAVELER, password: travelerHash });
  console.log(`✅ Traveler: ${traveler.email}`);

  // Create provider
  const providerHash = await bcrypt.hash(DEMO_PROVIDER.password, 10);
  const provider = await User.create({ ...DEMO_PROVIDER, password: providerHash });
  console.log(`✅ Provider: ${provider.email}`);

  // Create admin
  const adminHash = await bcrypt.hash(ADMIN_USER.password, 10);
  const admin = await User.create({ ...ADMIN_USER, password: adminHash });
  console.log(`✅ Admin:    ${admin.email}`);

  // Delete existing demo trips by this provider
  await Trip.deleteMany({ provider: provider._id });

  // Create trips
  const createdTrips = [];
  for (const tripData of TRIPS) {
    const trip = await Trip.create({ ...tripData, creator: provider._id });
    createdTrips.push(trip);
    console.log(`✅ Trip: ${trip.source} → ${trip.destination} (${trip.status})`);
  }

  // Create a booking for traveler on first trip
  await Booking.deleteMany({ user: traveler._id });
  const booking = await Booking.create({
    trip: createdTrips[0]._id,
    user: traveler._id,
    seatsBooked: [1],
    ratePerKm: 8,
    totalPrice: createdTrips[0].kilometer * 8,
    status: "Active",
    paymentMethod: "cash",
    paymentStatus: "pending",
  });
  console.log(`✅ Booking created: ${createdTrips[0].source} → ${createdTrips[0].destination}`);

  // Also create a completed booking for rating demo
  const completedBooking = await Booking.create({
    trip: createdTrips[5]._id,
    user: traveler._id,
    seatsBooked: [2],
    ratePerKm: 8,
    totalPrice: createdTrips[5].kilometer * 8,
    status: "Completed",
    paymentMethod: "cash",
    paymentStatus: "paid",
  });
  console.log(`✅ Completed booking created for rating demo`);

  console.log("\n" + "=".repeat(55));
  console.log("🎉 SEED COMPLETE!");
  console.log("=".repeat(55));
  console.log("\n👤 TRAVELER");
  console.log(`   Email:    dhananjay1807d@gmail.com`);
  console.log(`   Phone:    9769565004`);
  console.log(`   Password: Travel@1234`);
  console.log(`   Login:    /login  →  /traveler-dashboard`);
  console.log("\n🚗 PROVIDER (Driver)");
  console.log(`   Email:    dhananjay1807d+pr@gmail.com`);
  console.log(`   Phone:    9769565004`);
  console.log(`   Password: Travel@1234`);
  console.log(`   Login:    /login  →  /provider-dashboard`);
  console.log("\n🛡️  ADMIN");
  console.log(`   Email:    dhananjay1807d+admin@gmail.com`);
  console.log(`   Phone:    9769565004`);
  console.log(`   Password: Travel@1234`);
  console.log(`   Login:    /login  →  /admin`);
  console.log("\n💡 All OTPs are sent to dhananjay1807d@gmail.com (Gmail + aliases)");
  console.log("\n📊 Created:");
  console.log(`   ${createdTrips.length} trips (5 active, 1 completed)`);
  console.log(`   2 bookings (1 active, 1 completed)`);
  console.log("=".repeat(50) + "\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
