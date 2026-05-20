# Step-by-Step Implementation

1. Frontend foundation: Vite React TypeScript, Tailwind theme, Redux store, Axios API client and protected routing.
2. Role UX: customer, vendor and admin dashboard surfaces with reusable cards, tables, charts and responsive layouts.
3. Auth API: bcrypt password hashing, JWT access tokens, refresh cookie, email verification and OTP reset flows.
4. Data layer: Mongoose models for users, vendors, events, bookings, payments, guests, reviews, notifications, AI recommendations and budgets.
5. Marketplace: public vendor search with category/city filters, ratings and booking entry points.
6. Event operations: event creation, budget line items, bookings, RSVP guests and QR check-in.
7. AI services: OpenAI planning endpoint with graceful fallback when no key is configured.
8. Payments: Stripe payment intent creation and payment persistence.
9. Notifications: Socket.io rooms by user ID plus email/SMS provider hooks.
10. Deployment: Vercel frontend, Render API and MongoDB Atlas database.

## Hardening Backlog

- Add Jest/Vitest and Supertest coverage for auth, RBAC and booking flows.
- Add Stripe webhook route with raw body parser.
- Add Cloudinary upload streaming from Multer memory buffers.
- Add audit logging for admin actions.
- Add queue-based retries for email, SMS and AI calls.
