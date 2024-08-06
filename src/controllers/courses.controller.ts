import { type Request, type Response, type NextFunction } from "express";
import ControllerHandler from "../handlers/controllers.handler";
import {
  getCourses,
  registerCourse,
  updateCourse,
} from "../services";

export default class CoursesController {
  private constructor() { }

  // -- Register a new Course --
  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const courseData = await registerCourse(req.body);
      if (!courseData.result) return ControllerHandler.badRequest(courseData.message, res)
      return ControllerHandler.created('Course created', courseData.course, res)
    } catch (err) {
      next(err);
    }
  }

  // -- Update a Course --
  public static async update(req: Request, res: Response, next: NextFunction) {
    const course_id = parseInt(req.params.course_id as string);
    try {
      const result = await updateCourse({ ...req.body, id: course_id });
      if (!result) return ControllerHandler.notFound('Course not updated.', res)
      return ControllerHandler.ok('Course updated successfully.', res)
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
      if (!courses || courses.length === 0) return ControllerHandler.notFound('Courses not found', res)
      return ControllerHandler.ok('Courses found', res, courses)
    } catch (err) {
      next(err);
    }
  }

}


