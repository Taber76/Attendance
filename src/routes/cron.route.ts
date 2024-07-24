import express from 'express';
import CronController from '../controllers/cron.controller.js';

export const cronRouter = express
  .Router() // Path: /api/cron

  // -- Routes --
  .get('/updateAttendance', CronController.updateAttendance)

