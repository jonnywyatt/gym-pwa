import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import routes from './routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  })
);
app.use(express.json());

// Routes
app.use(routes);

app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}`);
});
