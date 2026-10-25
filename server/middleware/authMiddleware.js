import crypto from 'crypto';
import { env } from '../config/env.js';
import ApiError from '../utils/ApiError.js';

// Admin access uses a secret API key. Send it as the X-Admin-Key header from Postman or curl.
export function requireAdmin(req, res, next) {
  const provided = Buffer.from(req.get('X-Admin-Key') || '');
  const expected = Buffer.from(env.adminApiKey);

  const isValid = provided.length === expected.length && crypto.timingSafeEqual(provided, expected);
  if (!isValid) return next(new ApiError(401, 'Admin access denied'));

  return next();
}