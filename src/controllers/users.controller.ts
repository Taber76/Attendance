import { type Request, type Response, type NextFunction } from "express";
import HTTP_STATUS from "../constants/httpStatusCodes"
import UserDTO from "../dto/user.dto";
import {
  registerUser,
  loginUser,
  activeUser,
  forgotPassword,
  resetPassword,
  updateUser,
  getUsers,
} from "../services";

export default class UsersController {
  private constructor() { }

  private static ok(message: string, res: Response, data?: any, token?: string) {
    const response: any = { result: true, message }
    if (data) response.data = data
    if (token) response.token = token
    return res.status(HTTP_STATUS.OK).json(response)
  }

  private static created(message: string, data: any, res: Response) {
    return res.status(HTTP_STATUS.CREATED).json({
      result: true,
      message,
      data
    })
  }

  private static badRequest(message: string, res: Response) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      result: false,
      message
    })
  }

  private static notFound(message: string, res: Response) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      result: false,
      message
    })
  }



  // -- Register a new user --
  public static async register(req: Request, res: Response, next: NextFunction) {
    const { error, value } = UserDTO.register(req.body, req.user);
    if (error) return this.badRequest(error.message, res)
    try {
      const userData = await registerUser(value);
      return this.created(
        'User created successfully. Please check your email to activate your account.',
        userData, res)
    } catch (err) {
      next(err);
    }
  }

  // -- Login a user --
  public static async login(req: Request, res: Response, next: NextFunction) {
    const { error, value } = UserDTO.login(req.body);
    if (error) return this.badRequest(error.message, res)
    try {
      const { userData, token } = await loginUser(value);
      return this.ok('User logged in successfully.', res, userData, token)
    } catch (err) {
      next(err);
    }
  }

  // -- Confirm email with code --
  public static async confirm(req: Request, res: Response, next: NextFunction) {
    const { code } = req.params;
    try {
      const result = await activeUser(code);
      if (result) return this.ok('User activated successfully.', res)
      return this.notFound('User not found.', res)
    } catch (err) {
      next(err);
    }
  }

  // -- Forgot password --
  public static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const { error, value } = UserDTO.forgotPassword(req.body);
    if (error) return this.badRequest(error.message, res)
    try {
      await forgotPassword(value);
      return this.ok('Email sent', res)
    } catch (err) {
      next(err);
    }
  }

  // -- Reset password --
  public static async resetPassword(req: Request, res: Response, next: NextFunction) {
    const { error, value } = UserDTO.resetPassword(req.body);
    if (error) return this.badRequest(error.message, res)
    try {
      const result = await resetPassword(value);
      if (result) return this.ok('Password changed successfully.', res)
      return this.notFound('User not found.', res)
    } catch (err) {
      next(err);
    }
  }


  // -- Update user --
  public static async update(req: Request, res: Response, next: NextFunction) {
    const user = req.params.user_id ? { id: req.params.user_id } : req.user;
    const { error, value } = UserDTO.updateUser(req.body, user);
    if (error) return this.badRequest(error.message, res)
    try {
      const result = await updateUser(value);
      if (result) return this.ok('User updated successfully.', res)
      return this.notFound('User not found.', res)
    } catch (err) {
      next(err);
    }
  }


  // -- Get user/s --
  public static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.user_id ? parseInt(req.params.user_id as string) : null;
      const users = await getUsers(userId);
      if (users) return this.ok('Users found', res, users)
      return this.notFound('Users not found.', res)
    } catch (err) {
      next(err);
    }
  }



}


