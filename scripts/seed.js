/**
 * Seed script — creates demo users + realistic-looking platform data
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

// ── Demo credentials (testing accounts — keep as-is) ─────────────────────────

const DEMO_PROVIDER = {
  name: "Dhananjay (Provider)",
  email: "dhananjay1807d+pr@gmail.com",
  password: "Travel@1234",
  role: "provider",
  phone: "9769565004",
  isVerified: true,
  avgRating: 4.8,
  totalRatings: 12,
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

// ── Demo provider's trips ─────────────────────────────────────────────────────

const DEMO_TRIPS = [
  {
    tripname: "Delhi to Jaipur Express",
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
    contact: "9769565004",
    status: "Active",
  },
  {
    tripname: "Mumbai to Pune Quick",
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
    contact: "9769565004",
    status: "Active",
  },
  {
    tripname: "Bangalore to Hyderabad",
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
    contact: "9769565004",
    status: "Active",
  },
  {
    tripname: "Delhi to Agra Day Trip",
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
    contact: "9769565004",
    status: "Active",
  },
  {
    tripname: "Chandigarh to Manali",
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
    contact: "9769565004",
    status: "Active",
  },
  {
    tripname: "Delhi to Lucknow Express",
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
    contact: "9769565004",
    status: "Completed",
  },
];

// ── Realistic extra providers ─────────────────────────────────────────────────

const EXTRA_PROVIDERS = [
  {
    name: "Rajesh Kumar",
    email: "rajesh.kumar.driver@seed.traveleasyhaiapp.com",
    password: "Seed@1234",
    role: "provider",
    phone: "9811045678",
    isVerified: true,
    avgRating: 4.7,
    totalRatings: 34,
  },
  {
    name: "Suresh Verma",
    email: "suresh.verma.driver@seed.traveleasyhaiapp.com",
    password: "Seed@1234",
    role: "provider",
    phone: "9922134567",
    isVerified: true,
    avgRating: 4.5,
    totalRatings: 21,
  },
  {
    name: "Amit Singh",
    email: "amit.singh.driver@seed.traveleasyhaiapp.com",
    password: "Seed@1234",
    role: "provider",
    phone: "9833267890",
    isVerified: true,
    avgRating: 4.9,
    totalRatings: 58,
  },
  {
    name: "Priya Sharma",
    email: "priya.sharma.driver@seed.traveleasyhaiapp.com",
    password: "Seed@1234",
    role: "provider",
    phone: "9744378901",
    isVerified: true,
    avgRating: 4.6,
    totalRatings: 17,
  },
  {
    name: "Deepak Nair",
    email: "deepak.nair.driver@seed.traveleasyhaiapp.com",
    password: "Seed@1234",
    role: "provider",
    phone: "9655489012",
    isVerified: true,
    avgRating: 4.8,
    totalRatings: 42,
  },
];

// ── Realistic extra travelers ─────────────────────────────────────────────────

const EXTRA_TRAVELERS = [
  {
    name: "Anjali Mehta",
    email: "anjali.mehta@seed.traveleasyhaiapp.com",
    password: "Seed@1234",
    role: "traveler",
    phone: "9876012345",
    isVerified: true,
  },
  {
    name: "Rohit Gupta",
    email: "rohit.gupta@seed.traveleasyhaiapp.com",
    password: "Seed@1234",
    role: "traveler",
    phone: "9765123456",
    isVerified: true,
  },
  {
    name: "Sneha Patel",
    email: "sneha.patel@seed.traveleasyhaiapp.com",
    password: "Seed@1234",
    role: "traveler",
    phone: "9654234567",
    isVerified: true,
  },
  {
    name: "Vikram Yadav",
    email: "vikram.yadav@seed.traveleasyhaiapp.com",
    password: "Seed@1234",
    role: "traveler",
    phone: "9543345678",
    isVerified: true,
  },
];

// ── Extra trips per extra provider ───────────────────────────────────────────
// Index aligns with EXTRA_PROVIDERS array

const EXTRA_TRIPS_PER_PROVIDER = [
  // Rajesh Kumar — North India routes
  [
    {
      tripname: "Delhi to Haridwar Pilgrimage",
      source: "New Delhi",
      destination: "Haridwar",
      sourceCoords: { lat: 28.6139, lng: 77.209 },
      destinationCoords: { lat: 29.9457, lng: 78.1642 },
      date: getFutureDate(2),
      time: "05:30 AM",
      seats: 4,
      bookedseats: 2,
      kilometer: 220,
      vehicle: "INNOVA CRYSTA",
      vehicleType: "SUV",
      meetPlace: "Kashmere Gate Metro Exit 2",
      contact: "9811045678",
      status: "Active",
    },
    {
      tripname: "Dehradun to Delhi Morning Run",
      source: "Dehradun",
      destination: "New Delhi",
      sourceCoords: { lat: 30.3165, lng: 78.0322 },
      destinationCoords: { lat: 28.6139, lng: 77.209 },
      date: getFutureDate(4),
      time: "06:00 AM",
      seats: 3,
      bookedseats: 1,
      kilometer: 302,
      vehicle: "HONDA CITY",
      vehicleType: "CAR",
      meetPlace: "ISBT Dehradun Platform 3",
      contact: "9811045678",
      status: "Active",
    },
    {
      tripname: "Delhi to Chandigarh Weekend",
      source: "New Delhi",
      destination: "Chandigarh",
      sourceCoords: { lat: 28.6139, lng: 77.209 },
      destinationCoords: { lat: 30.7333, lng: 76.7794 },
      date: getPastDate(7),
      time: "08:00 AM",
      seats: 4,
      bookedseats: 4,
      kilometer: 265,
      vehicle: "INNOVA CRYSTA",
      vehicleType: "SUV",
      meetPlace: "Majnu ka Tila",
      contact: "9811045678",
      status: "Completed",
    },
  ],

  // Suresh Verma — West India routes
  [
    {
      tripname: "Pune to Mumbai Early Bird",
      source: "Pune",
      destination: "Mumbai",
      sourceCoords: { lat: 18.5204, lng: 73.8567 },
      destinationCoords: { lat: 19.076, lng: 72.8777 },
      date: getFutureDate(1),
      time: "06:00 AM",
      seats: 3,
      bookedseats: 1,
      kilometer: 149,
      vehicle: "SWIFT DZIRE",
      vehicleType: "CAR",
      meetPlace: "Shivajinagar Bus Depot",
      contact: "9922134567",
      status: "Active",
    },
    {
      tripname: "Ahmedabad to Vadodara",
      source: "Ahmedabad",
      destination: "Vadodara",
      sourceCoords: { lat: 23.0225, lng: 72.5714 },
      destinationCoords: { lat: 22.3072, lng: 73.1812 },
      date: getFutureDate(3),
      time: "10:00 AM",
      seats: 4,
      bookedseats: 2,
      kilometer: 113,
      vehicle: "ERTIGA",
      vehicleType: "VAN",
      meetPlace: "Kalupur Railway Station",
      contact: "9922134567",
      status: "Active",
    },
    {
      tripname: "Mumbai to Nashik",
      source: "Mumbai",
      destination: "Nashik",
      sourceCoords: { lat: 19.076, lng: 72.8777 },
      destinationCoords: { lat: 19.9975, lng: 73.7898 },
      date: getPastDate(3),
      time: "07:00 AM",
      seats: 4,
      bookedseats: 3,
      kilometer: 167,
      vehicle: "SWIFT DZIRE",
      vehicleType: "CAR",
      meetPlace: "CST Station Forecourt",
      contact: "9922134567",
      status: "Completed",
    },
  ],

  // Amit Singh — South India routes
  [
    {
      tripname: "Chennai to Bangalore Night",
      source: "Chennai",
      destination: "Bangalore",
      sourceCoords: { lat: 13.0827, lng: 80.2707 },
      destinationCoords: { lat: 12.9716, lng: 77.5946 },
      date: getFutureDate(1),
      time: "10:00 PM",
      seats: 4,
      bookedseats: 3,
      kilometer: 346,
      vehicle: "FORTUNER",
      vehicleType: "SUV",
      meetPlace: "Chennai Central Railway Station Gate 1",
      contact: "9833267890",
      status: "Active",
    },
    {
      tripname: "Hyderabad to Vijayawada",
      source: "Hyderabad",
      destination: "Vijayawada",
      sourceCoords: { lat: 17.385, lng: 78.4867 },
      destinationCoords: { lat: 16.5062, lng: 80.648 },
      date: getFutureDate(2),
      time: "08:30 AM",
      seats: 5,
      bookedseats: 2,
      kilometer: 275,
      vehicle: "TEMPO TRAVELLER",
      vehicleType: "BUS",
      meetPlace: "Secunderabad Station",
      contact: "9833267890",
      status: "Active",
    },
    {
      tripname: "Bangalore to Coimbatore",
      source: "Bangalore",
      destination: "Coimbatore",
      sourceCoords: { lat: 12.9716, lng: 77.5946 },
      destinationCoords: { lat: 11.0168, lng: 76.9558 },
      date: getFutureDate(6),
      time: "07:00 AM",
      seats: 4,
      bookedseats: 1,
      kilometer: 357,
      vehicle: "FORTUNER",
      vehicleType: "SUV",
      meetPlace: "Silk Board Junction",
      contact: "9833267890",
      status: "Active",
    },
    {
      tripname: "Bangalore to Mysore Express",
      source: "Bangalore",
      destination: "Mysore",
      sourceCoords: { lat: 12.9716, lng: 77.5946 },
      destinationCoords: { lat: 12.2958, lng: 76.6394 },
      date: getPastDate(10),
      time: "09:00 AM",
      seats: 4,
      bookedseats: 4,
      kilometer: 143,
      vehicle: "FORTUNER",
      vehicleType: "SUV",
      meetPlace: "Kempegowda Bus Stand",
      contact: "9833267890",
      status: "Completed",
    },
  ],

  // Priya Sharma — East India routes
  [
    {
      tripname: "Kolkata to Durgapur",
      source: "Kolkata",
      destination: "Durgapur",
      sourceCoords: { lat: 22.5726, lng: 88.3639 },
      destinationCoords: { lat: 23.4793, lng: 87.3194 },
      date: getFutureDate(2),
      time: "08:00 AM",
      seats: 4,
      bookedseats: 2,
      kilometer: 165,
      vehicle: "MARUTI BALENO",
      vehicleType: "CAR",
      meetPlace: "Howrah Station Gate 4",
      contact: "9744378901",
      status: "Active",
    },
    {
      tripname: "Bhubaneswar to Puri",
      source: "Bhubaneswar",
      destination: "Puri",
      sourceCoords: { lat: 20.2961, lng: 85.8245 },
      destinationCoords: { lat: 19.8135, lng: 85.8312 },
      date: getFutureDate(4),
      time: "07:30 AM",
      seats: 4,
      bookedseats: 1,
      kilometer: 60,
      vehicle: "HONDA AMAZE",
      vehicleType: "CAR",
      meetPlace: "Bhubaneswar Railway Station",
      contact: "9744378901",
      status: "Active",
    },
  ],

  // Deepak Nair — Kerala / Goa routes
  [
    {
      tripname: "Kochi to Thiruvananthapuram",
      source: "Kochi",
      destination: "Thiruvananthapuram",
      sourceCoords: { lat: 9.9312, lng: 76.2673 },
      destinationCoords: { lat: 8.5241, lng: 76.9366 },
      date: getFutureDate(1),
      time: "06:00 AM",
      seats: 4,
      bookedseats: 3,
      kilometer: 215,
      vehicle: "TOYOTA ETIOS",
      vehicleType: "CAR",
      meetPlace: "Ernakulam South Railway Station",
      contact: "9655489012",
      status: "Active",
    },
    {
      tripname: "Goa to Pune Weekend",
      source: "Panaji",
      destination: "Pune",
      sourceCoords: { lat: 15.4909, lng: 73.8278 },
      destinationCoords: { lat: 18.5204, lng: 73.8567 },
      date: getFutureDate(3),
      time: "05:00 AM",
      seats: 4,
      bookedseats: 2,
      kilometer: 460,
      vehicle: "INNOVA CRYSTA",
      vehicleType: "SUV",
      meetPlace: "Panjim Bus Terminal",
      contact: "9655489012",
      status: "Active",
    },
    {
      tripname: "Kozhikode to Bangalore",
      source: "Kozhikode",
      destination: "Bangalore",
      sourceCoords: { lat: 11.2588, lng: 75.7804 },
      destinationCoords: { lat: 12.9716, lng: 77.5946 },
      date: getPastDate(4),
      time: "08:00 PM",
      seats: 4,
      bookedseats: 4,
      kilometer: 362,
      vehicle: "TOYOTA ETIOS",
      vehicleType: "CAR",
      meetPlace: "Kozhikode Railway Station",
      contact: "9655489012",
      status: "Completed",
    },
  ],
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

  // ── 1. Demo accounts (recreate cleanly) ─────────────────────────────────

  await User.deleteOne({ email: DEMO_PROVIDER.email });
  await User.deleteOne({ email: DEMO_TRAVELER.email });
  await User.deleteOne({ email: ADMIN_USER.email });

  const travelerHash = await bcrypt.hash(DEMO_TRAVELER.password, 10);
  const traveler = await User.create({ ...DEMO_TRAVELER, password: travelerHash });
  console.log(`✅ Traveler: ${traveler.email}`);

  const providerHash = await bcrypt.hash(DEMO_PROVIDER.password, 10);
  const provider = await User.create({ ...DEMO_PROVIDER, password: providerHash });
  console.log(`✅ Provider: ${provider.email}`);

  const adminHash = await bcrypt.hash(ADMIN_USER.password, 10);
  const admin = await User.create({ ...ADMIN_USER, password: adminHash });
  console.log(`✅ Admin:    ${admin.email}`);

  // ── 2. Demo provider's trips ─────────────────────────────────────────────

  await Trip.deleteMany({ provider: provider._id });

  const createdDemoTrips = [];
  for (const tripData of DEMO_TRIPS) {
    const trip = await Trip.create({ ...tripData, provider: provider._id });
    createdDemoTrips.push(trip);
    console.log(`✅ Demo trip: ${trip.source} → ${trip.destination} (${trip.status})`);
  }

  // ── 3. Demo traveler's bookings ──────────────────────────────────────────

  await Booking.deleteMany({ user: traveler._id });

  await Booking.create({
    trip: createdDemoTrips[0]._id,
    user: traveler._id,
    seatsBooked: [1],
    ratePerKm: 8,
    totalPrice: createdDemoTrips[0].kilometer * 8,
    status: "Active",
    paymentMethod: "cash",
    paymentStatus: "pending",
  });
  console.log(`✅ Booking (active): ${createdDemoTrips[0].source} → ${createdDemoTrips[0].destination}`);

  await Booking.create({
    trip: createdDemoTrips[5]._id,
    user: traveler._id,
    seatsBooked: [2],
    ratePerKm: 8,
    totalPrice: createdDemoTrips[5].kilometer * 8,
    status: "Completed",
    paymentMethod: "cash",
    paymentStatus: "paid",
  });
  console.log(`✅ Booking (completed): ${createdDemoTrips[5].source} → ${createdDemoTrips[5].destination}`);

  // ── 4. Extra providers & travelers ──────────────────────────────────────

  console.log("\n🔄 Seeding realistic platform data...");

  const seedEmails = [
    ...EXTRA_PROVIDERS.map(p => p.email),
    ...EXTRA_TRAVELERS.map(t => t.email),
  ];
  await User.deleteMany({ email: { $in: seedEmails } });

  const hash = await bcrypt.hash("Seed@1234", 10);

  const createdProviders = [];
  for (const providerData of EXTRA_PROVIDERS) {
    const p = await User.create({ ...providerData, password: hash });
    createdProviders.push(p);
    console.log(`  ✅ Provider: ${p.name}`);
  }

  const createdTravelers = [];
  for (const travelerData of EXTRA_TRAVELERS) {
    const t = await User.create({ ...travelerData, password: hash });
    createdTravelers.push(t);
    console.log(`  ✅ Traveler: ${t.name}`);
  }

  // ── 5. Extra trips ───────────────────────────────────────────────────────

  const allExtraTrips = [];
  for (let i = 0; i < createdProviders.length; i++) {
    const p = createdProviders[i];
    const trips = EXTRA_TRIPS_PER_PROVIDER[i] || [];

    // Clear old seed trips for this provider
    await Trip.deleteMany({ provider: p._id });

    for (const tripData of trips) {
      const trip = await Trip.create({ ...tripData, provider: p._id });
      allExtraTrips.push(trip);
    }
    console.log(`  ✅ ${trips.length} trips for ${p.name}`);
  }

  // ── 6. Realistic bookings from extra travelers ───────────────────────────

  // Scatter bookings across active extra trips so dashboards look populated
  const activeExtraTrips = allExtraTrips.filter(t => t.status === "Active");
  const completedExtraTrips = allExtraTrips.filter(t => t.status === "Completed");

  const bookingsToCreate = [];

  // Each traveler books 2–3 active trips
  const travelerBookingMap = [
    { traveler: createdTravelers[0], tripIndexes: [0, 2, 5] },
    { traveler: createdTravelers[1], tripIndexes: [1, 4, 7] },
    { traveler: createdTravelers[2], tripIndexes: [3, 6, 8] },
    { traveler: createdTravelers[3], tripIndexes: [0, 9, 10] },
  ];

  for (const { traveler: t, tripIndexes } of travelerBookingMap) {
    for (const idx of tripIndexes) {
      const trip = activeExtraTrips[idx % activeExtraTrips.length];
      if (!trip) continue;
      bookingsToCreate.push({
        trip: trip._id,
        user: t._id,
        seatsBooked: [1],
        ratePerKm: 8,
        totalPrice: trip.kilometer * 8,
        status: "Active",
        paymentMethod: "cash",
        paymentStatus: "pending",
      });
    }
  }

  // Add completed bookings for completed trips
  for (let i = 0; i < completedExtraTrips.length && i < createdTravelers.length; i++) {
    const trip = completedExtraTrips[i];
    const t = createdTravelers[i % createdTravelers.length];
    bookingsToCreate.push({
      trip: trip._id,
      user: t._id,
      seatsBooked: [1, 2],
      ratePerKm: 8,
      totalPrice: trip.kilometer * 8 * 2,
      status: "Completed",
      paymentMethod: "cash",
      paymentStatus: "paid",
    });
  }

  if (bookingsToCreate.length > 0) {
    await Booking.insertMany(bookingsToCreate);
    console.log(`  ✅ ${bookingsToCreate.length} realistic bookings created`);
  }

  // ── Summary ──────────────────────────────────────────────────────────────

  const totalTrips = createdDemoTrips.length + allExtraTrips.length;
  const activeTrips = [...createdDemoTrips, ...allExtraTrips].filter(t => t.status === "Active").length;

  console.log("\n" + "=".repeat(55));
  console.log("🎉 SEED COMPLETE!");
  console.log("=".repeat(55));
  console.log("\n👤 TRAVELER (testing account)");
  console.log(`   Email:    dhananjay1807d@gmail.com`);
  console.log(`   Phone:    9769565004`);
  console.log(`   Password: Travel@1234`);
  console.log("\n🚗 PROVIDER (testing account)");
  console.log(`   Email:    dhananjay1807d+pr@gmail.com`);
  console.log(`   Phone:    9769565004`);
  console.log(`   Password: Travel@1234`);
  console.log("\n🛡️  ADMIN (testing account)");
  console.log(`   Email:    dhananjay1807d+admin@gmail.com`);
  console.log(`   Phone:    9769565004`);
  console.log(`   Password: Travel@1234`);
  console.log("\n📊 Platform data:");
  console.log(`   ${createdProviders.length + 1} providers  |  ${createdTravelers.length + 1} travelers  |  1 admin`);
  console.log(`   ${totalTrips} trips (${activeTrips} active)  |  ${bookingsToCreate.length + 2} bookings`);
  console.log(`\n💡 All test OTPs go to dhananjay1807d@gmail.com`);
  console.log("=".repeat(55) + "\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err.message);
  process.exit(1);
});
