import { Request, Response, NextFunction } from "express";
import HTTP_STATUS from "../constants/httpStatusCodes";



export function errorHandler(error: any, req: Request, res: Response, next: NextFunction) {
  console.log(error.stack)

  if (error.name === "SequelizeValidationError" || error.name === "SequelizeDatabaseError") {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      success: false,
      message: error.message,
      error: error.errors?.map((e: any) => e.message).join(", ") ?? error.name ?? error
    });
  }

  res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error.message || "Internal server error.",
    error: error.errors?.map((e: any) => e.message).join(", ") ?? error.name ?? "InternalServerError"
  });
}
