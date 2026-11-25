/** Application-wide constants — single source of truth */

// ── Route paths ──────────────────────────────────────────────
export const ROUTES = {
    // Public
    HOME:            "/",
    SIGN_IN:         "/login",
    SIGN_UP:         "/register",
    VERIFY_EMAIL:    "/verifyemail",

    // Passenger
    PASSENGER_HOME:  "/traveler-dashboard",
    AVAILABLE_RIDES: "/available-rides",
    MY_BOOKINGS:     "/travelertrips",
    PROFILE:         "/profile",

    // Driver
    DRIVER_HOME:     "/provider-dashboard",
    DRIVER_RIDES:    "/providertrips",
    DRIVER_REQUESTS: "/provider-booking-requests",
    DRIVER_EARNINGS: "/provider-earnings",
    CREATE_RIDE:     "/provider-dashboard/create",

    // Admin
    ADMIN:           "/admin",
    ADMIN_USERS:     "/admin/users",
    ADMIN_REPORTS:   "/admin/reports",
};

// ── User roles ───────────────────────────────────────────────
export const ROLES = {
    TRAVELER: "traveler",
    PROVIDER: "provider",
    ADMIN:    "admin",
};

// Role → home route mapping
export const ROLE_HOME = {
    [ROLES.TRAVELER]: ROUTES.PASSENGER_HOME,
    [ROLES.PROVIDER]: ROUTES.DRIVER_HOME,
    [ROLES.ADMIN]:    ROUTES.ADMIN,
};

// ── Booking / Ride statuses ───────────────────────────────────
export const BOOKING_STATUS = {
    ACTIVE:    "Active",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
    PENDING:   "Pending",
};

export const RIDE_STATUS = {
    ACTIVE:    "Active",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
};

// ── Pricing ──────────────────────────────────────────────────
export const PRICE_PER_KM = parseInt(
    process.env.NEXT_PUBLIC_PRICE_PER_KM_SINGLESEAT || "8"
);

// ── Validation ───────────────────────────────────────────────
export const VALIDATION = {
    PHONE_REGEX:   /^\d{10,15}$/,
    EMAIL_REGEX:   /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PAN_REGEX:     /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    VEHICLE_REGEX: /^[A-Z0-9]+$/,
    NAME_REGEX:    /^[a-zA-Z\s.]{2,50}$/,
};
