import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import path from 'path';

import './middlewares/passport';
import { analyticsRouter } from './routes/analytics';
import { authRouter } from './routes/auth';
import { budgetsRouter } from './routes/budgets';
import { categoriesRouter } from './routes/categories';
import { operationsRouter } from './routes/operations';
import { usersRouter } from './routes/users';
import initDatabase from './db/initDatabase';
import passport from 'passport';

/**
 * Create DB and the tables if they are not present
 */
initDatabase();

/**
 * Init Express with the Passport middleware
 */
export const app = express();
const port = process.env.port || 8080;
const staticFolder = [__dirname, '../../client/build'];

app.use(cors());
app.use(express.static(path.join(...staticFolder)));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  '/api/analytics',
  passport.authenticate('jwt', { session: false }),
  analyticsRouter,
);
app.use('/api/auth', authRouter);
app.use(
  '/api/budgets',
  passport.authenticate('jwt', { session: false }),
  budgetsRouter,
);
app.use(
  '/api/categories',
  passport.authenticate('jwt', { session: false }),
  categoriesRouter,
);
app.use(
  '/api/operations',
  passport.authenticate('jwt', { session: false }),
  operationsRouter,
);
app.use(
  '/api/users',
  passport.authenticate('jwt', { session: false }),
  usersRouter,
);

// Default route
if (process.env.NODE_ENV === 'production')
  app.get('*', (_req, res) =>
    res.sendFile(path.join(...staticFolder, '/index.html')),
  );

app.listen(port, () => console.log(`App listening on port ${port}!`));
