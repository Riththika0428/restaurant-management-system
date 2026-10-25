import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import foodRoutes from './routes/foodRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import { env } from './config/env.js';
import { notFound } from './middleware/notFoundMiddleware.js';
import { errorHandler } from './middleware/errorMiddleware.js';

const app = express();

if (env.isProduction) app.set('trust proxy', 1);

app.use(helmet());

app.use(
  cors({
    origin(origin, callback) {
      // Requests without an Origin header (curl, Postman) pass through. Browsers must match CLIENT_URL.
      if (!origin || env.clientUrls.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Order-Token', 'X-Admin-Key'],
  })
);

app.use(express.json({ limit: '10kb' }));

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Savora API is running' });
});

app.use('/api/foods', foodRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;