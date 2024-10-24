import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import hpp from 'hpp';

import { PORT, API_VERSION, CORS_ORIGIN } from './environment.js';
import { errorHandler } from '../middlewares/error.middleware.js';
import PostgrePool from './postgre.pool.js';
import passport from '../middlewares/auth.mid.js';
import * as usersRouter from '../routes/users.routes.js';
import * as studentsRouter from '../routes/students.routes.js';
import * as subjectsRouter from '../routes/subjects.routes.js';
import * as coursesRouter from '../routes/courses.routes.js';
import * as attendanceRouter from '../routes/attendance.routes.js';
import * as cronRouter from '../routes/cron.routes.js';
import * as qrRouter from '../routes/qr.routes.js';

export default class Server {
  public app: express.Application;
  private server: any;

  constructor() {
    this.app = express();
    this.database();
    this.middlewares();
    this.routes();
    this.errorHandler();
    this.listen();
  }

  private async database() {
    const db = await PostgrePool.getInstance();
    /*  if (SYNC_DB === 1) {
        try {
          await db.sync();
          console.log('Database synchronized successfully.');
        } catch (err) {
          console.error('Unable to sync the database:', err);
        }
      }
     */
  }

  private middlewares() {
    this.app.use(helmet())
    this.app.use(hpp())
    this.app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false }));
    this.app.use(cors({ origin: CORS_ORIGIN }));
    this.app.use(express.json());
  }

  private routes() {
    // -- Unprotected routes --
    this.app.use(`/${API_VERSION}/users`, usersRouter.notProtectedRoutes);
    this.app.use(`/${API_VERSION}/cron`, cronRouter.notProtectedRoutes);
    this.app.use(`/${API_VERSION}/qr`, qrRouter.notProtectedRoutes);

    // -- User protected routes --
    this.app.use(passport.authenticate('userJWT', { session: false }));
    this.app.use(`/${API_VERSION}/users`, usersRouter.userProtectedRoutes);
    this.app.use(`/${API_VERSION}/students`, studentsRouter.userProtectedRoutes);
    this.app.use(`/${API_VERSION}/subjects`, attendanceRouter.userProtectedRoutes);
    this.app.use(`/${API_VERSION}/attendances`, attendanceRouter.userProtectedRoutes);
    this.app.use(`/${API_VERSION}/courses`, coursesRouter.userProtectedRoutes);

    // -- Admin protected routes --
    this.app.use(passport.authenticate('adminJWT', { session: false }));
    this.app.use(`/${API_VERSION}/users`, usersRouter.adminProtectedRoutes);
    this.app.use(`/${API_VERSION}/students`, coursesRouter.adminProtectedRoutes);
    this.app.use(`/${API_VERSION}/subjects`, subjectsRouter.adminProtectedRoutes);
    this.app.use(`/${API_VERSION}/courses`, coursesRouter.adminProtectedRoutes);
  }

  private errorHandler() {
    this.app.use(errorHandler);
  }

  private listen() {
    this.server = this.app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }

  public close() {
    this.server.close();
  }
}
