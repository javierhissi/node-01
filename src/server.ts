import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
// import algo from "./ts-test/uno";

import express, { Request, Response } from 'express';
import 'express-async-errors';

import apiRouter from './routes/api';

// Constants
const app = express();

/** *********************************************************************************
 *                                  Middlewares
 ********************************************************************************* */

// Common middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Show routes called in console during development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Security (helmet recommended in express docs)
if (process.env.NODE_ENV === 'production') {
  app.use(helmet());
}

/** *********************************************************************************
 *                         API routes and error handling
 ********************************************************************************* */

// Add api router
app.use('/api', apiRouter);

/** *********************************************************************************
 *                                  Front-end content
 ********************************************************************************* */

// Set views dir
const viewsDir = path.join(__dirname, 'views');
app.set('views', viewsDir);

// Set static dir
const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

// Serve index.html file
app.get('*', (_: Request, res: Response) => {
  res.sendFile('index.html', { root: viewsDir });
});

// algo();

// Export here and start in a diff file (for testing).
export default app;
