import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRouter from '../routes/auth.route';
import eventRouter from '../routes/event.route';
import newsRouter from '../routes/news.route';
require('dotenv').config();


const initializeServer = () => {
  const server = express();

  server.use(express.json());
  server.use(express.urlencoded({ extended: true }));
  server.use(
    cors({
      origin: true,
      exposedHeaders: ['Authorization'],
    })
  );

  server.use('/api/auth', authRouter);
  server.use('/api/events', eventRouter);
  server.use('/api/newsfeed', newsRouter);

  // Optional origin restriction middleware (when deployment)
  /*
  server.use((req: Request, res: Response, next: NextFunction) => {
    const allowedOrigin = 'https://YOUR_WEBSITE_LINK';
    const origin = req.headers.origin;

    if (!origin || origin !== allowedOrigin) {
      console.log(origin);
      return res.status(403).json({ error: 'Origin not allowed' });
    }

    next();
  });
  */

  server.use((req: Request, res: Response, next: NextFunction) => {
    console.log(req.url);
    next();
  });


  // routes goes here
  server.get('/', (req: Request, res: Response) => {
    res.send('IEEE sayes hello world!');
  });

  // ...

  return server;
};

const MONGO_URI = process.env.MONGO_URI || '';
const DB_NAME = 'IEEEAlexBranch'; 

mongoose.connect(MONGO_URI, { dbName: DB_NAME })
  .then(() => {
    console.log('Mongoose connected');
    const server = initializeServer();
    const PORT = Number(process.env.PORT) || 8081;
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB:', err);
  });

// For Vercel deployment (serverless)
// export default async (req: Request, res: Response) => {
//   try {
//     const server = await serverReady;
//     return server(req, res);
//   } catch (err) {
//     return res.status(500).send('Server initialization failed.');
//   }
// };