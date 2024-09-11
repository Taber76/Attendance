var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import ControllerHandler from "../handlers/controllers.handler.js";
import AttendanceDTO from "../dto/attendance.dto.js";
import { getNonAttendance, getAttendanceByDate, registerAttendance, updateNotAttendedById } from "../services/index.js";
export default class CoursesController {
    constructor() { }
    // -- Register attendance --
    static register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { error, value } = AttendanceDTO.register(req.body);
                if (error)
                    return ControllerHandler.badRequest(error.message, res);
                const attendanceData = yield registerAttendance(value);
                if (!attendanceData.result)
                    return ControllerHandler.badRequest(attendanceData.message, res);
                return ControllerHandler.created('Registered attendance', attendanceData.course, res);
            }
            catch (err) {
                next(err);
            }
        });
    }
    // -- Update not attended --
    static updateNotAttendedById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const nonAttendance_id = parseInt(req.params.nonAttendance_id);
            const type = req.params.type;
            try {
                const result = yield updateNotAttendedById({ id: nonAttendance_id, type: type });
                if (!result)
                    return ControllerHandler.notFound('Non attendance not updated.', res);
                return ControllerHandler.ok('Non attendance updated successfully.', res);
            }
            catch (err) {
                next(err);
            }
        });
    }
    // -- Get not attended --
    static getNotAttendedByStudent(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = parseInt(req.params.student_id);
                const nonAttendances = yield getNonAttendance(studentId);
                if (!nonAttendances || nonAttendances.length === 0)
                    return ControllerHandler.notFound('Non attendances not found', res);
                return ControllerHandler.ok('Non attendances found', res, nonAttendances);
            }
            catch (err) {
                next(err);
            }
        });
    }
    // -- Get attendance by date --
    static getAttendanceByDate(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const date = req.params.date;
                const course_id = req.params.course_id != "0" ? parseInt(req.params.course_id) : null;
                const attendances = yield getAttendanceByDate(date, course_id);
                if (!attendances || attendances.length === 0)
                    return ControllerHandler.notFound('Attendances not found', res);
                return ControllerHandler.ok('Attendances found', res, attendances);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
