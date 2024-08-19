import express from 'express';

import SubjectsController from '../controllers/subjects.controller.js';

// Path: /api/subjects
// -- Admin protected routes --
export const adminProtectedRoutes = express
  .Router()
  .get('/', SubjectsController.getAll) // '/subjects' para traer todos los subjects y '/subjects?courseId=4' para traer los subjects filtadas por course
  .post('/register', SubjectsController.create)
  .put('/update/:subject_id', SubjectsController.update)
  .put('/addstudents/:subject_id', SubjectsController.addStudents)
  .delete('/delete/:subject_id', SubjectsController.delete)




