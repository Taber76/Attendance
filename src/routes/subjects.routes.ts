import express from 'express';

import passport from '../middlewares/auth.mid.js';
import SubjectsController from '../controllers/subjects.controller.js';

export const subjectsRouter = express
  .Router() // Path: /api/subjects

  // -- Middlewares --
  .use(passport.authenticate('adminJWT', { session: false }))

  // -- Routes --
  .get('/', SubjectsController.getAll) // '/subjects' para traer todos los subjects y '/subjects?courseId=4' para traer los subjects filtadas por course
  .post('/register', SubjectsController.create)
  .put('/update/:subject_id', SubjectsController.update)
  .put('/addstudents/:subject_id', SubjectsController.addStudents)
  .delete('/delete/:subject_id', SubjectsController.delete)




