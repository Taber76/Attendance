import express from 'express';
import passport from '../middlewares/auth.mid.js';
import UsersController from '../controllers/users.controller.js';
import UserController from '../controllers/users.controller.2.js';

export const usersRouter = express
  .Router() // Path: /api/users

  // -- Not protected routes --
  .get('/confirm/:code', UsersController.confirm)
  .post('/login', UsersController.login)
  .post('/register', UserController.register)
  .post('/forgotpassword', UsersController.forgotPassword)
  .post('/resetpassword', UsersController.resetPassword)

  // -- User protected routes --
  .use(passport.authenticate('userJWT', { session: false }))
  .put('/update', UsersController.update)

// -- Admin protected routes --
const adminProtectedRoutes = express.Router()
  .use(passport.authenticate('adminJWT', { session: false }))
  .get('/', UsersController.getUsers)
  .get('/:user_id', UsersController.getById)
  .post('/admin/register', UsersController.register)
  .put('/assignrole/:user_id', UsersController.assignRole)
  .put('/update/:user_id', UsersController.updateByAdmin)
  .delete('/delete/:user_id', UsersController.delete)
usersRouter.use(adminProtectedRoutes)


