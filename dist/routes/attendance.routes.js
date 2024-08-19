import express from 'express';
import AttendanceController from '../controllers/attendance.controller.js';
// Path: /api/attendance
// -- User protected routes --
export const userProtectedRoutes = express
    .Router()
    .get('/attendance/getByStudent/:student_id', AttendanceController.getNotAttendedByStudent)
    .post('/attendance/register', AttendanceController.register)
    .put('/attendance/update/:nonAttendance_id/:type', AttendanceController.updateNotAttendedById);
