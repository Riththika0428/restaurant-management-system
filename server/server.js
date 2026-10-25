import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import app from './app.js';

await connectDB(env.mongoUri);

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