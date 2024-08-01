import { type Request, type Response, type NextFunction } from "express";
import HTTP_STATUS from "../constants/httpStatusCodes"
import {
  getStudents,
  registerStudent,
  updateStudent,
  registerStudentsWithExcel
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



  // -- Register a new Student --
  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const studentData = await registerStudent(req.body);
      if (!studentData.result) return this.badRequest(studentData.message, res)
      return this.created('Student created', studentData.student, res)
    } catch (err) {
      next(err);
    }
  }

  // -- Update a Student --
  public static async update(req: Request, res: Response, next: NextFunction) {
    const student_id = parseInt(req.params.student_id as string);
    try {
      const result = await updateStudent({ ...req.body, id: student_id });
      if (!result) return this.notFound('Student not updated.', res)
      return this.ok('Student updated successfully.', res)
    } catch (err) {
      next(err);
    }
  }

  // -- Get student/s --
  public static async getStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.params.student_id ? parseInt(req.params.student_id as string) : null;
      const courseId = req.params.course_id ? parseInt(req.params.course_id as string) : null;
      const active = studentId === 0 ? false : true;
      const students = await getStudents(studentId, active, courseId);
      if (!students) return this.notFound('Students not found', res)
      return this.ok('Students found', res, students)
    } catch (err) {
      next(err);
    }
  }

  // -- Excel students import --
  public static async excelImport(req: Request, res: Response, next: NextFunction) {
    if (!req.file || !req.body.name || !req.body.surname) {
      return this.badRequest('File and column name and surname are required', res)
    }
    try {
      const students = await registerStudentsWithExcel(req.file, req.body);
      return this.ok('Students imported successfully.', res, students)
    } catch (err) {
      next(err);
    }
  }

}


