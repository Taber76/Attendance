import express from 'express';
import passport from '../middlewares/auth.mid.js';
import ControllerHandler from '../controllers/courses.controller.js';
export const coursesRouter = express
    .Router() // Path: /api/courses
    // -- Middlewares --
    .use(passport.authenticate('adminJWT', { session: false }))
    // -- Routes --
    .get('/', ControllerHandler.getCourses)
    .get('/:course_id', ControllerHandler.getCourses) // course_id = 0 -> all deleted
    .post('/register', ControllerHandler.register)
    .put('/update/:course_id', ControllerHandler.update);
//  .put('/addsubjects/:course_id', CoursesControllerOLD.addSubjects)
//  .put('/restore/:course_id', CoursesControllerOLD.restore)
//  .delete('/delete/:course_id', CoursesControllerOLD.delete)
