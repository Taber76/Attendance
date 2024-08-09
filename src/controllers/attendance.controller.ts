import { type Request, type Response, type NextFunction } from "express";

import ControllerHandler from "../handlers/controllers.handler.js";
import {
  getNonAttendance,
  registerAttendance,
  updateNotAttendedById
} from "../services/index.js";
import { NonAttendanceType } from "../types/nonattendance.types.js";

export default class CoursesController {
  private constructor() { }

  // -- Register attendance --
  public static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const attendanceData = await registerAttendance(req.body);
      if (!attendanceData.result) return ControllerHandler.badRequest(attendanceData.message, res)
      return ControllerHandler.created('Registered attendance', attendanceData.course, res)
    } catch (err) {
      next(err);
    }
  }

  // -- Update not attended --
  public static async updateNotAttendedById(req: Request, res: Response, next: NextFunction) {
    const nonAttendance_id = parseInt(req.params.nonAttendance_id as string);
    const type = req.params.type as string;
    try {
      const result = await updateNotAttendedById({ id: nonAttendance_id, type: type as NonAttendanceType });
      if (!result) return ControllerHandler.notFound('Non attendance not updated.', res)
      return ControllerHandler.ok('Non attendance updated successfully.', res)
    } catch (err) {
      next(err);
    }
  }

  // -- Get not attended --
  public static async getNotAttendedByStudent(req: Request, res: Response, next: NextFunction) {
    try {
      const studentId = parseInt(req.params.student_id as string);
      const nonAttendances = await getNonAttendance(studentId);
      if (!nonAttendances || nonAttendances.length === 0) return ControllerHandler.notFound('Non attendances not found', res)
      return ControllerHandler.ok('Non attendances found', res, nonAttendances)
    } catch (err) {
      next(err);
    }
  }

}


