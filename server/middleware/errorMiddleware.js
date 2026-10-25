import { env } from '../config/env.js';
import ApiError from '../utils/ApiError.js';

export function errorHandler(err, req, res, next) {
  let statusCode = 500;
  let message = 'Something went wrong. Please try again later.';
  let errors = null;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400;
    message = 'Malformed JSON in request body';
  } else if (err.type === 'entity.too.large') {
    statusCode = 413;
    message = 'Request body is too large';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid identifier';
  } else if (err.name === 'ValidationError') {
    statusCode = 422;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({ field: e.path, message: e.message }));
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'A record with this value already exists';
  } else if (err.message === 'Not allowed by CORS') {
    statusCode = 403;
    message = 'Origin not allowed';
  }

  if (statusCode >= 500) {
    console.error('Unhandled error:', env.isProduction ? err.message : err);
  }

  const body = { success: false, message, errors };
  if (!env.isProduction && statusCode === 500) body.stack = err.stack;

  res.status(statusCode).json(body);
}