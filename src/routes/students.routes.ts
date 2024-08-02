import express from 'express';
import multer from 'multer';
import passport from '../middlewares/auth.mid.js';
import StudentsController from '../controllers/students.controller.js';


export const studentsRouter = express
  .Router() // Path: /api/students

  // -- Middlewares --
  .use(passport.authenticate('userJWT', { session: false }))

  // -- Routes --
  .get('/', StudentsController.getStudents)
  .get('/:student_id', StudentsController.getStudents) // if student_id 0 => get all deleted
  .get('/course/:course_id', StudentsController.getStudents)

  .post('/register', StudentsController.register)
  .post('/excel-import', multer().single('file'), StudentsController.excelImport)

  .put('/update/:student_id', StudentsController.update)
  .put('/update-many', StudentsController.updateMany) // Only courseId in body { studentIds: [1,2,3,...], courseId: 4 }
