"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.attendanceRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_mid_js_1 = __importDefault(require("../middlewares/auth.mid.js"));
const attendance_controller_js_1 = __importDefault(require("../controllers/attendance.controller.js"));
exports.attendanceRouter = express_1.default
    .Router()
    // -- Middlewares --
    .use(auth_mid_js_1.default.authenticate('userJWT', { session: false }))
    // -- Routes --
    .get('/attendance/getByStudent/:studentId', attendance_controller_js_1.default.getNotAttendedByStudent)
    .post('/attendance/register/:studentId', attendance_controller_js_1.default.register)
    .put('/attendance/update/:nonAttendanceId/:type', attendance_controller_js_1.default.updateNotAttendedById);
