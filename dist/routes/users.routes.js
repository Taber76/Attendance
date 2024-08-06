import express from 'express';
import passport from '../middlewares/auth.mid.js';
import UsersController from '../controllers/users.controller.js';
export const usersRouter = express
    .Router() // Path: /api/users
    // -- Not protected routes --
    .get('/confirm/:code', UsersController.confirm)
    .post('/login', UsersController.login) //ok
    .post('/register', UsersController.register) //ok
    .post('/forgotpassword', UsersController.forgotPassword)
    .post('/resetpassword', UsersController.resetPassword)
    // -- User protected routes --
    .use(passport.authenticate('userJWT', { session: false }))
    .put('/update', UsersController.update);
// -- Admin protected routes --
const adminProtectedRoutes = express.Router()
    .use(passport.authenticate('adminJWT', { session: false }))
    .get('/', UsersController.getUsers) //ok
    .get('/:user_id', UsersController.getUsers) //ok
    .post('/admin/register', UsersController.register) //ok
    .put('/update/:user_id', UsersController.update);
//.delete('/delete/:user_id', UsersControllerOLD.delete)
usersRouter.use(adminProtectedRoutes);
