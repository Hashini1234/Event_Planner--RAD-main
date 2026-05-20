# CelebrateLK System Architecture

## Modules

- Authentication: registration, login, logout, email verification, OTP reset, JWT access token and refresh cookie.
- Customer: event creation, vendor discovery, bookings, guest list, RSVP, QR check-in, budgets and AI planner.
- Vendor: service packages, availability, booking acceptance, earnings and reviews.
- Admin: user management, vendor approval, complaints, reports and platform monitoring.
- Notifications: Socket.io in-app events plus email and SMS service hooks.
- Payments: Stripe payment intents, payment history and refund-ready data model.

## Request Flow

1. Client sends authenticated REST request with `Authorization: Bearer <token>`.
2. Express applies Helmet, CORS, rate limiting and JSON parsing.
3. `authenticate` verifies JWT and loads the active user.
4. `authorize` checks role permissions.
5. Controller validates ownership and calls a model/service.
6. Mongoose persists data in MongoDB Atlas.
7. Notification service emits Socket.io events and optional email/SMS.

## Production Concerns

- Use strong 32+ character JWT secrets.
- Keep refresh tokens in HTTP-only secure cookies.
- Use MongoDB indexes for role, vendor category, city, booking status and event date.
- Store images in Cloudinary rather than local disk.
- Process Stripe webhooks with raw body middleware before JSON parsing in a production hardening pass.
- Add background jobs for email/SMS retries and scheduled reminders.
