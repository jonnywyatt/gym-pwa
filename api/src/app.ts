import cors from 'cors';
import express from 'express';
import routes from './routes';

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  })
);
app.use(express.json());

// Routes
app.use(routes);

export default app;
