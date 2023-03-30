import express, { ErrorRequestHandler } from 'express';
import * as dotenv from 'dotenv';
dotenv.config({ path: process.cwd() + '/.env' });

import mongoose from 'mongoose';

import pollRoutes from './routes/poll';
import { WebSocketServer } from './services/websocket-server';

const port = Number(process.env.PORT) || 8001;
const webSocketServerPort = Number(process.env.WEBSOCKET_PORT) || 3000;
const mongodbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017';

declare global {
  namespace Express {
    export interface Request {
      webSocketServerClient: WebSocketServer;
    }
  }
}

const server = async () => {
  const app = express();

  app.use(express.json());

  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, OPTIONS, PUT, PATCH, DELETE',
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'content-type, Authorization',
    );
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    next();
  });

  const wss = new WebSocketServer({ port: webSocketServerPort });
  wss.subscribeToOnlineUsers();

  app.use((req, res, next) => {
    req.webSocketServerClient = wss;
    next();
  });

  app.use('/api', pollRoutes);

  const errHandler: ErrorRequestHandler = (error, req, res, next) => {
    console.log(error);

    if (!error.statusCode) {
      error.statusCode = 500;
      error.message = 'Server Error';
    }

    const errRes = {
      error: {
        message: error.message,
        status: error.statusCode,
      },
    };

    res.status(error.statusCode).json(errRes);
  };

  app.use(errHandler);

  await mongoose.connect(mongodbURI);

  app.listen(port, function () {
    console.log('Server started on port: ' + port);
  });
};

server().catch((err) => console.log(err));
