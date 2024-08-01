import { type Request, type Response, type NextFunction } from "express";
import HTTP_STATUS from "../constants/httpStatusCodes"
import {
  getCourses,
  registerCourse,
  updateCourse,
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



  // -- Register a new Course --
  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const courseData = await registerCourse(req.body);
      if (!courseData.result) return this.badRequest(courseData.message, res)
      return this.created('Course created', courseData.course, res)
    } catch (err) {
      next(err);
    }
  }

  // -- Update a Student --
  public static async update(req: Request, res: Response, next: NextFunction) {
    const course_id = parseInt(req.params.course_id as string);
    try {
      const result = await updateCourse({ ...req.body, id: course_id });
      if (!result) return this.notFound('Course not updated.', res)
      return this.ok('Course updated successfully.', res)
    } catch (err) {
      next(err);
    }
  }

  // -- Get course/s --
  public static async getCourses(req: Request, res: Response, next: NextFunction) {
    try {
      const courseId = req.params.course_id ? parseInt(req.params.course_id as string) : null;
      const active = courseId === 0 ? false : true;
      const courses = await getCourses(courseId, active);
      if (!courses) return this.notFound('Courses not found', res)
      return this.ok('Courses found', res, courses)
    } catch (err) {
      next(err);
    }
  }

}


