import { type Request, type Response, type NextFunction } from "express";
import HTTP_STATUS from "../constants/httpStatusCodes"
import UserService from "../services/user.service";
import UserDTO from "../dto/user.dto";

export default class UserController {
  private constructor() { }

  // -- Register a new user --
  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { error, value } = UserDTO.register(req.body, req.user);
      if (error) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          success: false, message: error.message
        });
      }

      const result = await UserService.register(value);

      return res.status(HTTP_STATUS.CREATED).json({
        success: true,
        message: 'User created successfully. Please check your email to activate your account.',
        result
      })

    } catch (err) {
      next(err);
    }
  }


}