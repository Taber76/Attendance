import { type Request, type Response, type NextFunction } from "express";

import ControllerHandler from "../handlers/controllers.handler.js";
import UserDTO from "../dto/user.dto.js";
import {
  registerUser,
  loginUser,
  activeUser,
  forgotPassword,
  resetPassword,
  updateUser,
  getUsers,
} from "../services/index.js";

export default class UsersController {
  private constructor() { }

  // -- Register a new user --
  public static async register(req: Request, res: Response, next: NextFunction) {
    const { error, value } = UserDTO.register(req.body, req.user);
    if (error) return ControllerHandler.badRequest(error.message, res)
    try {
      const userData = await registerUser(value);
      return ControllerHandler.created(
        'User created successfully. Please check your email to activate your account.',
        userData, res)
    } catch (err) {
      next(err);
    }
  }

  // -- Login a user --
  public static async login(req: Request, res: Response, next: NextFunction) {
    const { error, value } = UserDTO.login(req.body);
    if (error) return ControllerHandler.badRequest(error.message, res)
    try {
      const { userData, token } = await loginUser(value);
      return ControllerHandler.ok('User logged in successfully.', res, userData, token)
    } catch (err) {
      next(err);
    }
  }

  // -- Confirm email with code --
  public static async confirm(req: Request, res: Response, next: NextFunction) {
    const { code } = req.params;
    try {
      const result = await activeUser(code);
      if (result) return ControllerHandler.ok('User activated successfully.', res)
      return ControllerHandler.notFound('User not found.', res)
    } catch (err) {
      next(err);
    }
  }

  // -- Forgot password --
  public static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const { error, value } = UserDTO.forgotPassword(req.body);
    if (error) return ControllerHandler.badRequest(error.message, res)
    try {
      await forgotPassword(value);
      return ControllerHandler.ok('Email sent', res)
    } catch (err) {
      next(err);
    }
  }

  // -- Reset password --
  public static async resetPassword(req: Request, res: Response, next: NextFunction) {
    const { error, value } = UserDTO.resetPassword(req.body);
    if (error) return ControllerHandler.badRequest(error.message, res)
    try {
      const result = await resetPassword(value);
      if (result) return ControllerHandler.ok('Password changed successfully.', res)
      return ControllerHandler.notFound('User not found.', res)
    } catch (err) {
      next(err);
    }
  }


  // -- Update user --
  public static async update(req: Request, res: Response, next: NextFunction) {
    const user = req.params.user_id ? { id: req.params.user_id } : req.user;
    const { error, value } = UserDTO.updateUser(req.body, user);
    if (error) return ControllerHandler.badRequest(error.message, res)
    try {
      const result = await updateUser(value);
      if (result) return ControllerHandler.ok('User updated successfully.', res)
      return ControllerHandler.notFound('User not found.', res)
    } catch (err) {
      next(err);
    }
  }


  // -- Get user/s --
  public static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.user_id ? parseInt(req.params.user_id as string) : null;
      const users = await getUsers(userId);
      if (users) return ControllerHandler.ok('Users found', res, users)
      return ControllerHandler.notFound('Users not found.', res)
    } catch (err) {
      next(err);
    }
  }



}


