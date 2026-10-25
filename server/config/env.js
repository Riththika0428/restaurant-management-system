import 'dotenv/config';

const REQUIRED = ['MONGODB_URI', 'CLIENT_URL', 'ADMIN_API_KEY'];

const missing = REQUIRED.filter((key) => !process.env[key]);
if (missing.length > 0) {
  throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
}

if (process.env.ADMIN_API_KEY.length < 32) {
  throw new Error('ADMIN_API_KEY must be at least 32 characters long');
}

const readNumber = (value, fallback) => {
  const parsed = Number(value);
  return value !== undefined && value !== '' && Number.isFinite(parsed) && parsed >= 0
    ? parsed
    : fallback;
};

export const env = Object.freeze({
  port: readNumber(process.env.PORT, 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  isProduction: process.env.NODE_ENV === 'production',
  mongoUri: process.env.MONGODB_URI,
  clientUrls: process.env.CLIENT_URL.split(',').map((url) => url.trim()).filter(Boolean),
  adminApiKey: process.env.ADMIN_API_KEY,
  deliveryFee: readNumber(process.env.DELIVERY_FEE, 3.5),
  freeDeliveryThreshold: readNumber(process.env.FREE_DELIVERY_THRESHOLD, 30),
});