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

  // -- Register a new Student --
  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const studentData = await registerStudent(req.body);
      if (!studentData.result) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
          result: false,
          message: studentData.message
        })
      }
      return res.status(HTTP_STATUS.CREATED).json({
        result: true,
        message: 'Student created',
        student: studentData.student
      })

    } catch (err) {
      next(err);
    }
  }


  // -- Update a Student --
  public static async update(req: Request, res: Response, next: NextFunction) {
    const student_id = parseInt(req.params.student_id as string);
    try {
      const result = await updateStudent({ ...req.body, id: student_id });
      if (result) {
        return res.status(HTTP_STATUS.OK).json({
          result: true,
          message: 'Student updated successfully.'
        })
      }
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        result: false,
        message: 'Student not updated.'
      })
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
      if (students) {
        return res.status(HTTP_STATUS.OK).json({
          result: true,
          message: 'Students found',
          students: students
        })
      }
      return res.status(HTTP_STATUS.NOT_FOUND).json({
        result: false,
        message: 'Students not found'
      })
    } catch (err) {
      next(err);
    }
  }

  // -- Excel Import --
  public static async excelImport(req: Request, res: Response, next: NextFunction) {
    if (!req.file || !req.body.name || !req.body.surname) {
      return res.status(HTTP_STATUS.BAD_REQUEST).json({
        result: false,
        message: 'Excel file and column name and surname are required'
      })
    }
    try {
      const students = await registerStudentsWithExcel(req.file, req.body);
      return res.status(HTTP_STATUS.OK).json({
        result: true,
        message: 'Students imported successfully.',
        students
      })
    } catch (err) {
      next(err);
    }
  }



}


