import { type Request, type Response, type NextFunction } from "express";
import HTTP_STATUS from "../constants/httpStatusCodes"
import UserDTO from "../dto/user.dto";
import { registerUser, loginUser } from "../services/users";

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


}


