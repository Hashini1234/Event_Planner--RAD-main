# CelebrateLK Backend

Express + MongoDB + JWT backend for the CelebrateLK MERN stack app.

## Run

```bash
npm install
copy .env.example .env
npm run dev
```

Default URL: http://localhost:5000

If `MONGODB_URI` is not set, auth runs in local memory mode for development. Add a real MongoDB connection string in `.env` for permanent saved users.
