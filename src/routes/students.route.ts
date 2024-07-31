import express from 'express';
import multer from 'multer';
import passport from '../middlewares/auth.mid.js';
import StudentsControllerOLD from '../controllers/students.controller.old.js';
import StudentsController from '../controllers/students.controller.js';


export const studentsRouter = express
  .Router() // Path: /api/students

  // -- Middlewares --
  //.use(passport.authenticate('userJWT', { session: false }))

  // -- Routes --
  .get('/', StudentsController.getStudents) //ok
  .get('/:student_id', StudentsController.getStudents) //ok if student_id 0 => get all deleted
  .get('/course/:course_id', StudentsController.getStudents)
  //.get('/deleted', StudentsControllerOLD.getDeleted) // deprecated

  .post('/register', StudentsController.register) //ok
  .post('/excel-import', multer().single('file'), StudentsController.excelImport) //ok

  .put('/update/:student_id', StudentsController.update) //ok
//.put('/restore/:student_id', StudentsControllerOLD.restore) // deprecated

//.delete('/delete/:student_id', StudentsControllerOLD.delete) // deprecated
