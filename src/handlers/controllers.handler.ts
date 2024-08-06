import { type Response } from "express";

import HTTP_STATUS from "../constants/httpStatusCodes.js";

export default class ControllerHandler {
  private constructor() { }

  public static ok(message: string, res: Response, data?: any, token?: string) {
    const response: any = { result: true, message }
    if (data) response.data = data
    if (token) response.token = token
    return res.status(HTTP_STATUS.OK).json(response)
  }

  public static created(message: string, data: any, res: Response) {
    return res.status(HTTP_STATUS.CREATED).json({
      result: true,
      message,
      data
    })
  }

  public static badRequest(message: string, res: Response) {
    return res.status(HTTP_STATUS.BAD_REQUEST).json({
      result: false,
      message
    })
  }

  public static notFound(message: string, res: Response) {
    return res.status(HTTP_STATUS.NOT_FOUND).json({
      result: false,
      message
    })
  }

}