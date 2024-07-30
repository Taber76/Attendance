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

  // -- Register a new user --
  public static async register(req: Request, res: Response, next: NextFunction) {
    const { error, value } = UserDTO.register(req.body, req.user);
    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false, message: error.message
      });
    }
    try {
      const userData = await registerUser(value);
      return res.status(HTTP_STATUS.CREATED).json({
        result: true,
        message: 'User created successfully. Please check your email to activate your account.',
        user: userData
      })

    } catch (err) {
      next(err);
    }
  }

  // -- Login a user --
  public static async login(req: Request, res: Response, next: NextFunction) {
    const { error, value } = UserDTO.login(req.body);
    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false, message: error.message
      });
    }
    try {
      const { userData, token } = await loginUser(value);
      return res.status(HTTP_STATUS.OK).json({
        result: true,
        message: 'User logged in successfully.',
        user: userData,
        token
      })
    } catch (err) {
      next(err);
    }
  }

  // -- Confirm email with code --
  public static async confirm(req: Request, res: Response, next: NextFunction) {
    const { code } = req.params;
    try {
      const result = await activeUser(code);
      if (result) {
        return res.status(HTTP_STATUS.OK).json({
          result: true,
          message: 'User activated successfully.'
        })
      }
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        result: false,
        message: 'User not found.'
      })
    } catch (err) {
      next(err);
    }
  }

  // -- Forgot password --
  public static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    const { error, value } = UserDTO.forgotPassword(req.body);
    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false, message: error.message
      });
    }
    try {
      await forgotPassword(value);
      return res.status(HTTP_STATUS.OK).json({
        result: true,
        message: 'Email sent'
      })
    } catch (err) {
      next(err);
    }
  }

  // -- Reset password --
  public static async resetPassword(req: Request, res: Response, next: NextFunction) {
    const { error, value } = UserDTO.resetPassword(req.body);
    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false, message: error.message
      });
    }
    try {
      const result = await resetPassword(value);
      if (result) {
        return res.status(HTTP_STATUS.OK).json({
          result: true,
          message: 'Password changed successfully.'
        })
      }
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        result: false,
        message: 'User not found.'
      })
    } catch (err) {
      next(err);
    }
  }


  // -- Update user --
  public static async update(req: Request, res: Response, next: NextFunction) {
    const user = req.params.user_id ? { id: req.params.user_id } : req.user;
    const { error, value } = UserDTO.updateUser(req.body, user);
    if (error) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        success: false, message: error.message
      });
    }
    try {
      const result = await updateUser(value);
      if (result) {
        return res.status(HTTP_STATUS.OK).json({
          result: true,
          message: 'User updated successfully.'
        })
      }
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        result: false,
        message: 'User not found.'
      })
    } catch (err) {
      next(err);
    }
  }


  // -- Get user/s --
  public static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.params.user_id ? parseInt(req.params.user_id as string) : null;
      const users = await getUsers(userId);
      if (users) {
        return res.status(HTTP_STATUS.OK).json({
          result: true,
          message: 'Users found',
          users
        })
      }
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        result: false,
        message: 'Users not found'
      })
    } catch (err) {
      next(err);
    }
  }



}


