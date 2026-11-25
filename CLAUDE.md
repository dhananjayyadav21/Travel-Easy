# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build (Turbopack)
npm run start    # Start production server
npm run lint     # Run ESLint (flat config, ESLint 9)
```

No test framework is configured — there are no tests.

## Stack

- **Next.js 15** (App Router) · **React 19** · **JavaScript** (no TypeScript, no `tsconfig.json`)
- **MongoDB** via **Mongoose 8** — no Prisma, no SQL
- **Tailwind CSS v4** (PostCSS plugin: `@tailwindcss/postcss`)
- **Custom JWT auth** — no NextAuth/Auth.js
- Path alias `@/*` → project root (via `jsconfig.json`)

## Architecture

### Authentication Flow

Auth is fully custom — no NextAuth. The flow is:

1. `POST /api/auth/register` → bcrypt hash + 6-digit OTP → email via Nodemailer (Gmail SMTP)
2. `POST /api/auth/verifyemail` → OTP string comparison → marks `user.isVerified = true`
3. `POST /api/auth/login` → bcrypt compare → signs JWT `{ id, role }` with `JWT_SECRET` (7d expiry)
4. JWT stored in `localStorage` as `"token"`, user JSON as `"user"`

**API protection**: every protected route calls `verifyAuth(req)` from `utils/verifyAuth.js` — it reads the `Authorization: Bearer <token>` header, calls `jwt.verify()`, and returns `{ userId }` or a `401 NextResponse`. There is **no Next.js edge middleware**.

**Client-side guard**: `utils/ProtectedRoute.jsx` wraps pages that require login; it checks `localStorage.getItem("token")` on mount and redirects to `/login` if absent.

**Auth state across components**: login/logout dispatch `window.dispatchEvent(new Event("authChanged"))` — the Navbar listens to this instead of using shared state.

### Database

`lib/mongodb.js` exports `connectDB()` — a singleton using a module-scoped `isConnected` boolean. Call `await connectDB()` at the top of every API route handler before touching Mongoose models.

### Two User Roles

- **`traveler`** — can browse and book seats on trips
- **`provider`** — can create trips, view bookings, and mark trips complete/cancelled

The `role` field is stored in the JWT and in `localStorage["user"]`. Role-specific dashboards: `app/traveler-dashboard/` and `app/provider-dashboard/`.

### Pricing

`NEXT_PUBLIC_PRICE_PER_KM_SINGLESEAT` (env var, default `"8"`) is the per-seat per-km rate. It is exposed to the client. `Booking.ratePerKm` defaults to `8` in the schema. `totalPrice = seatsBooked.length × ratePerKm × kilometers`.

### Model Inconsistency

`models/Trip.js` uses CommonJS (`require`/`module.exports`) while `models/User.js` and `models/Booking.js` use ES module syntax (`import`/`export default`). Both work because Next.js handles both, but new models should use ES module syntax to be consistent with User and Booking.

## Environment Variables

Required in `.env.local`:

```
MONGODB_URI
JWT_SECRET
SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS / FROM_EMAIL
NEXT_PUBLIC_PRICE_PER_KM_SINGLESEAT
```

No `.env.example` exists — refer to this list when setting up locally.
