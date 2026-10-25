import mongoose from 'mongoose';

export async function connectDB(uri) {
  try {
    const connection = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

export async function disconnectDB() {
  await mongoose.disconnect();
}