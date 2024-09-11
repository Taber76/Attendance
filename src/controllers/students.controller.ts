import { type Request, type Response, type NextFunction } from "express";

import ControllerHandler from "../handlers/controllers.handler.js";
import {
  getStudents,
  registerStudent,
  updateStudent,
  updateManyStudents,
  registerStudentsWithExcel
} from "../services/index.js";

export default class StudentsController {
  private constructor() { }

  // -- Register a new Student --
  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const studentData = await registerStudent(req.body);
      if (!studentData.result) return ControllerHandler.badRequest(studentData.message, res)
      return ControllerHandler.created('Student created', studentData.student, res)
    } catch (err) {
      next(err);
    }
  }

  // -- Update a Student --
  public static async update(req: Request, res: Response, next: NextFunction) {
    const student_id = parseInt(req.params.student_id as string);
    try {
      const result = await updateStudent({ ...req.body, id: student_id });
      if (!result) return ControllerHandler.notFound('Student not updated.', res)
      return ControllerHandler.ok('Student updated successfully.', res)
    } catch (err) {
      next(err);
    }
  }

  // -- Update many Students -- Only course_id
  public static async updateMany(req: Request, res: Response, next: NextFunction) {
    const { studentIds, course_id } = req.body;
    try {
      const result = await updateManyStudents(studentIds, course_id);
      if (!result) return ControllerHandler.notFound('Students not updated.', res)
      return ControllerHandler.ok('Students updated successfully.', res)
    } catch (err) {
      next(err);
    }
  }

  // -- Get student/s --
  public static async getStudents(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = req.params.student_id ? parseInt(req.params.student_id as string) : null;
      const course_id = req.params.course_id ? parseInt(req.params.course_id as string) : null;
      const active = studentId === 0 ? false : true;
      const students = await getStudents(studentId, active, course_id);
      if (!students) return ControllerHandler.notFound('Students not found', res)
      return ControllerHandler.ok('Students found', res, students)
    } catch (err) {
      next(err);
    }
  }

  // -- Excel students import --
  public static async excelImport(req: Request, res: Response, next: NextFunction) {
    if (!req.file || !req.body.name || !req.body.surname) {
      return ControllerHandler.badRequest('File and column name and surname are required', res)
    }
    try {
      const students = await registerStudentsWithExcel(req.file, req.body);
      return ControllerHandler.ok('Students imported successfully.', res, students)
    } catch (err) {
      next(err);
    }
  }

}


