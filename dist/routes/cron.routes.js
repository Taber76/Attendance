import express from 'express';
import CronController from '../controllers/cron.controller.js';
// Path: /api/cron
// --Not protected routes--
export const notProtectedRoutes = express
    .Router()
    .get('/updateAttendance', CronController.updateAttendance);
