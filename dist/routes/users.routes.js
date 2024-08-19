import express from 'express';
import UsersController from '../controllers/users.controller.js';
// Path: /api/users
// -- Not protected routes --
export const notProtectedRoutes = express
    .Router()
    .get('/confirm/:code', UsersController.confirm)
    .post('/login', UsersController.login) //ok
    .post('/register', UsersController.register) //ok
    .post('/forgotpassword', UsersController.forgotPassword)
    .post('/resetpassword', UsersController.resetPassword);
// -- User protected routes --
export const userProtectedRoutes = express
    .Router()
    .put('/update', UsersController.update);
// -- Admin protected routes --
export const adminProtectedRoutes = express.Router()
    .get('/', UsersController.getUsers) //ok
    .get('/:user_id', UsersController.getUsers) //ok
    .post('/admin/register', UsersController.register) //ok
    .put('/update/:user_id', UsersController.update);
//.delete('/delete/:user_id', UsersControllerOLD.delete)
