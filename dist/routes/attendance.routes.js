import express from 'express';
import AttendanceController from '../controllers/attendance.controller.js';
// Path: /api/attendance
// -- User protected routes --
export const userProtectedRoutes = express
    .Router()
    .get('/getByStudent/:student_id', AttendanceController.getNotAttendedByStudent)
    .get('/getByDate/:date/:course_id', AttendanceController.getAttendanceByDate)
    .post('/register', AttendanceController.register)
    .put('/update/:nonAttendance_id/:type', AttendanceController.updateNotAttendedById);
