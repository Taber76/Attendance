import express from 'express';
import multer from 'multer';
import passport from '../middlewares/auth.mid.js';
import StudentsController from '../controllers/students.controller.js';


export const studentsRouter = express
  .Router() // Path: /api/students

  // -- Middlewares --
  .use(passport.authenticate('userJWT', { session: false }))

  // -- Routes --
  .get('', StudentsController.getStudents)
  .get('/deleted', StudentsController.getDeleted)

  .post('/register', StudentsController.register)
  .post('/excel-import', multer().single('file'), StudentsController.excelImport)

  .put('/update/:student_id', StudentsController.update)
  .put('/restore/:student_id', StudentsController.restore)

  .delete('/delete/:student_id', StudentsController.delete)
