import express from 'express';
import ControllerHandler from '../controllers/courses.controller.js';
// Path: /api/courses
// -- Admin protected routes --
export const adminProtectedRoutes = express
    .Router()
    .get('/', ControllerHandler.getCourses)
    .get('/:course_id', ControllerHandler.getCourses) // course_id = 0 -> all deleted
    .post('/register', ControllerHandler.register)
    .put('/update/:course_id', ControllerHandler.update);
//  .put('/addsubjects/:course_id', CoursesControllerOLD.addSubjects)
//  .put('/restore/:course_id', CoursesControllerOLD.restore)
//  .delete('/delete/:course_id', CoursesControllerOLD.delete)
