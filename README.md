# CelebrateLK

CelebrateLK is a premium MERN event management platform for the Sri Lankan market. It supports customers, vendors and admins with secure authentication, event planning, vendor marketplace, bookings, guest QR invitations, budget analytics, AI recommendations, payments and real-time notifications.

## Tech Stack

- Frontend: React 19, TypeScript, Tailwind CSS, Redux Toolkit, React Router, Axios, Framer Motion, Recharts, Socket.io client.
- Backend: Node.js, Express, TypeScript, JWT, bcrypt, RBAC, Mongoose, Multer, Socket.io.
- Integrations: Stripe, Cloudinary, OpenAI, Nodemailer email, Twilio SMS.
- Database: MongoDB Atlas with Mongoose models.

## Local Setup

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

```bash
cd server
npm install
copy .env.example .env
npm run dev
```

The API runs at `http://localhost:5000/api/v1`.

Use an email ending in `@demo` on the frontend login page for instant demo access without a backend token.

## Main Scripts

```bash
npm run dev       # Vite frontend
npm run build     # TypeScript + Vite production build
npm run lint      # ESLint
cd server && npm run dev
cd server && npm run build
```

## Architecture

```text
React/Vite client
  -> Redux auth/session
  -> Axios REST client
  -> Role protected routes
  -> Socket.io client notifications

Express API
  -> Helmet/CORS/rate limit
  -> JWT access tokens + refresh cookies
  -> RBAC middleware
  -> Controllers/services
  -> Mongoose models
  -> MongoDB Atlas
  -> Stripe/OpenAI/Cloudinary/Email/SMS providers
```

## Folder Structure

```text
src/
  components/        Reusable layout and UI components
  features/auth/     Redux auth slice
  hooks/             Typed Redux hooks
  layouts/           Protected app shell
  pages/             Product pages and dashboards
  services/          Axios API client
  store/             Redux store
  types/             Shared frontend types
  utils/             Formatting and demo data

server/src/
  config/            Environment, database and provider config
  controllers/       Route handlers
  middleware/        Auth, RBAC, validation, errors and uploads
  models/            Mongoose schemas
  routes/            REST endpoint registration
  services/          AI, payment and notification integrations
  utils/             Errors, tokens and endpoint metadata
  validation/        Zod request schemas
```

## Deployment

### MongoDB Atlas

1. Create a cluster and database named `celebratelk`.
2. Add an application database user.
3. Allow Render outbound access or use `0.0.0.0/0` for a student/demo deployment.
4. Copy the connection string to `MONGODB_URI`.

### Render API

1. Create a new Web Service from this repository.
2. Set root directory to `server`.
3. Build command: `npm install && npm run build`.
4. Start command: `npm start`.
5. Add environment variables from `server/.env.example`.
6. Set `CLIENT_URL` to the Vercel frontend URL.

### Vercel Frontend

1. Import the repository in Vercel.
2. Framework preset: Vite.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add `VITE_API_URL=https://your-render-api.onrender.com/api/v1`.

## Documentation

- [System architecture](docs/ARCHITECTURE.md)
- [API documentation](docs/API.md)
- [Database schema and ER diagram](docs/DATABASE.md)
- [Implementation guide](docs/IMPLEMENTATION.md)
