# CelebrateLK MERN Stack Structure

The project is now available as two separate apps:

- `frontend/` - React, Vite, Redux, Tailwind client
- `backend/` - Node, Express, MongoDB, JWT API

## Start Backend

```bash
cd backend
npm install
copy .env.example .env
npm run dev
```

Backend runs at http://localhost:5000.

## Start Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173.

## Auth

Register and login support these roles:

- Customer
- Vendor
- Admin

JWT access tokens are stored by the frontend and sent with API requests using the `Authorization: Bearer <token>` header.
