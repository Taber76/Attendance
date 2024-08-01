"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCodes_1 = __importDefault(require("../constants/httpStatusCodes"));
const services_1 = require("../services");
class UsersController {
    constructor() { }
    static ok(message, res, data, token) {
        const response = { result: true, message };
        if (data)
            response.data = data;
        if (token)
            response.token = token;
        return res.status(httpStatusCodes_1.default.OK).json(response);
    }
    static created(message, data, res) {
        return res.status(httpStatusCodes_1.default.CREATED).json({
            result: true,
            message,
            data
        });
    }
    static badRequest(message, res) {
        return res.status(httpStatusCodes_1.default.BAD_REQUEST).json({
            result: false,
            message
        });
    }
    static notFound(message, res) {
        return res.status(httpStatusCodes_1.default.NOT_FOUND).json({
            result: false,
            message
        });
    }
    // -- Register a new Student --
    static register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentData = yield (0, services_1.registerStudent)(req.body);
                if (!studentData.result)
                    return this.badRequest(studentData.message, res);
                return this.created('Student created', studentData.student, res);
            }
            catch (err) {
                next(err);
            }
        });
    }
    // -- Update a Student --
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const student_id = parseInt(req.params.student_id);
            try {
                const result = yield (0, services_1.updateStudent)(Object.assign(Object.assign({}, req.body), { id: student_id }));
                if (!result)
                    return this.notFound('Student not updated.', res);
                return this.ok('Student updated successfully.', res);
            }
            catch (err) {
                next(err);
            }
        });
    }
    // -- Get student/s --
    static getStudents(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = req.params.student_id ? parseInt(req.params.student_id) : null;
                const courseId = req.params.course_id ? parseInt(req.params.course_id) : null;
                const active = studentId === 0 ? false : true;
                const students = yield (0, services_1.getStudents)(studentId, active, courseId);
                if (!students)
                    return this.notFound('Students not found', res);
                return this.ok('Students found', res, students);
            }
            catch (err) {
                next(err);
            }
        });
    }
    // -- Excel students import --
    static excelImport(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!req.file || !req.body.name || !req.body.surname) {
                return this.badRequest('File and column name and surname are required', res);
            }
            try {
                const students = yield (0, services_1.registerStudentsWithExcel)(req.file, req.body);
                return this.ok('Students imported successfully.', res, students);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = UsersController;
