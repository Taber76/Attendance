import express from 'express';
import passport from '../middlewares/auth.mid.js';
import CoursesController from '../controllers/courses.controller.js';

export const coursesRouter = express
    .Router() // Path: /api/courses

    // -- Middlewares --
    .use(passport.authenticate('adminJWT', { session: false }))

    // -- Routes --
    .get('/', CoursesController.getCourses)
    .get('/:course_id', CoursesController.getCourses) // course_id = 0 -> all deleted

    .post('/register', CoursesController.register)

    .put('/update/:course_id', CoursesController.update)
//  .put('/addsubjects/:course_id', CoursesControllerOLD.addSubjects)
//  .put('/restore/:course_id', CoursesControllerOLD.restore)

//  .delete('/delete/:course_id', CoursesControllerOLD.delete)
