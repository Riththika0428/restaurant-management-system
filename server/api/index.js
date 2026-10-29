import app from '../app.js';
import { connectDB } from '../config/db.js';
import { env } from '../config/env.js';

// Vercel may start many instances. Each one connects once and reuses the connection.
export default async function handler(req, res) {
  try {
    await connectDB(env.mongoUri);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    res.status(503).json({ success: false, message: 'Database is unavailable. Please try again shortly.' });
    return;
  }

  return app(req, res);
}