import cors from 'cors';
import express from 'express';
import routes from './routes';

const app = express();

// Middleware
const allowedOrigins = process.env.CORS_ORIGIN?.includes(',')
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : process.env.CORS_ORIGIN;

app.use(
  cors({
    origin: allowedOrigins,
  })
);
app.use(express.json());

app.use((req, res, next) => {
  if (req.method === 'GET') {
    res.set('Cache-Control', 'no-cache');
  }
  next();
});

// Routes
app.use(routes);

export default app;
