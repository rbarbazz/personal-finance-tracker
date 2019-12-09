import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import path from 'path';

import './middlewares/passport';
import { analyticsRouter } from './routes/analytics';
import { authRouter } from './routes/auth';
import { budgetsRouter } from './routes/budgets';
import { categoriesRouter } from './routes/categories';
import { operationsRouter } from './routes/operations';
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
const staticFolder = __dirname + '/../client/build';

app.use(express.static(staticFolder));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(
  '/analytics',
  passport.authenticate('jwt', { session: false }),
  analyticsRouter,
);
app.use('/auth', authRouter);
app.use(
  '/budgets',
  passport.authenticate('jwt', { session: false }),
  budgetsRouter,
);
app.use(
  '/categories',
  passport.authenticate('jwt', { session: false }),
  categoriesRouter,
);
app.use(
  '/operations',
  passport.authenticate('jwt', { session: false }),
  operationsRouter,
);

// Default route
app.get('*', (_req, res) => {
  if (process.env.NODE_ENV === 'development') return res.send();

  return res.sendFile(path.join(`${staticFolder}/index.html`));
});

app.listen(port, () => console.log(`App listening on port ${port}!`));
