import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import app from './app.js';

try {
  await connectDB(env.mongoUri);
} catch (error) {
  console.error('MongoDB connection failed:', error.message);
  process.exit(1);
}

const server = app.listen(env.port, () => {
  console.log(`Savora API running on http://localhost:${env.port}`);
});

const shutdown = async () => {
  server.close();
  await disconnectDB();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);