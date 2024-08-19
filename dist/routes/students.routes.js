import express from 'express';
import multer from 'multer';
import StudentsController from '../controllers/students.controller.js';
// Path: /api/students
// -- User protected routes --
export const userProtectedRoutes = express
    .Router()
    .get('/', StudentsController.getStudents)
    .get('/:student_id', StudentsController.getStudents) // if student_id 0 => get all deleted
    .get('/course/:course_id', StudentsController.getStudents)
    .post('/register', StudentsController.register)
    .post('/excel-import', multer().single('file'), StudentsController.excelImport)
    .put('/update/:student_id', StudentsController.update)
    .put('/update-many', StudentsController.updateMany); // Only courseId in body { studentIds: [1,2,3,...], courseId: 4 }
