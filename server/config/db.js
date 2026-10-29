import mongoose from 'mongoose';

// Reuses an existing connection when one is open, so serverless invocations stay fast.
export async function connectDB(uri) {
  if (mongoose.connection.readyState === 1) return mongoose.connection;

  const connection = await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 8000,
    connectTimeoutMS: 8000,
    socketTimeoutMS: 30000,
    family: 4,
  });

  console.log(`MongoDB connected: ${connection.connection.host}`);
  return connection;
}

export async function disconnectDB() {
  await mongoose.disconnect();
}