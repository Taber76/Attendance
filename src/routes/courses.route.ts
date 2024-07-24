import express from 'express';
import passport from '../middlewares/auth.mid.js';
import CoursesController from '../controllers/courses.controller.js';

export const coursesRouter = express
    .Router() // Path: /api/courses

    // -- Middlewares --
    .use(passport.authenticate('adminJWT', { session: false }))

    // -- Routes --
    .get('/', CoursesController.getAll)
    .get('/deleted', CoursesController.getDeleted)

    .post('/register', CoursesController.create)

    .put('/update/:course_id', CoursesController.update)
    .put('/addsubjects/:course_id', CoursesController.addSubjects)
    .put('/restore/:course_id', CoursesController.restore)

    .delete('/delete/:course_id', CoursesController.delete)
