import express from 'express';
import cors from 'cors';
import { PORT, API_VERSION, CORS_ORIGIN } from './environment';
import { errorHandler } from '../middlewares/error.middleware';
import PostgreSQL from './postgre.client';
import { usersRouter, studentsRouter, subjectsRouter, coursesRouter, attendanceRouter, qrRouter, cronRouter } from '../routes';

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
    const db = await PostgreSQL.getInstance();
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
    this.app.use(cors({ origin: CORS_ORIGIN }));
    this.app.use(express.json());
  }

  private routes() {
    this.app.use(`/${API_VERSION}/users`, usersRouter);
    this.app.use(`/${API_VERSION}/students`, studentsRouter);
    this.app.use(`/${API_VERSION}/subjects`, subjectsRouter);
    this.app.use(`/${API_VERSION}/courses`, coursesRouter);
    this.app.use(`/${API_VERSION}/attendance`, attendanceRouter);
    this.app.use(`/${API_VERSION}/qr`, qrRouter);
    this.app.use(`/${API_VERSION}/cron`, cronRouter);
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
