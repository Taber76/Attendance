import express from 'express';
import passport from '../middlewares/auth.mid.js';
import UsersControllerOLD from '../controllers/users.controller.old.js';
import UsersController from '../controllers/users.controller.js';

export const usersRouter = express
  .Router() // Path: /api/users

  // -- Not protected routes --
  .get('/confirm/:code', UsersControllerOLD.confirm)
  .post('/login', UsersController.login)
  .post('/register', UsersController.register)
  .post('/forgotpassword', UsersControllerOLD.forgotPassword)
  .post('/resetpassword', UsersControllerOLD.resetPassword)

  // -- User protected routes --
  .use(passport.authenticate('userJWT', { session: false }))
  .put('/update', UsersControllerOLD.update)

// -- Admin protected routes --
const adminProtectedRoutes = express.Router()
  .use(passport.authenticate('adminJWT', { session: false }))
  .get('/', UsersControllerOLD.getUsers)
  .get('/:user_id', UsersControllerOLD.getById)
  .post('/admin/register', UsersController.register)
  .put('/assignrole/:user_id', UsersControllerOLD.assignRole)
  .put('/update/:user_id', UsersControllerOLD.updateByAdmin)
  .delete('/delete/:user_id', UsersControllerOLD.delete)
usersRouter.use(adminProtectedRoutes)


