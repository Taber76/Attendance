import express from 'express';
import passport from '../middlewares/auth.mid.js';
import AttendanceController from '../controllers/attendance.controller.js';


export const attendanceRouter = express
  .Router()

  // -- Middlewares --
  .use(passport.authenticate('userJWT', { session: false }))

  // -- Routes --
  .get('/attendance/getByStudent/:studentId', AttendanceController.getNotAttendedByStudent)

  .post('/attendance/register/:studentId', AttendanceController.register)

  .put('/attendance/update/:nonAttendanceId/:type', AttendanceController.updateNotAttendedById)

