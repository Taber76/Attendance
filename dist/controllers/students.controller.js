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
const controllers_handler_1 = __importDefault(require("../handlers/controllers.handler"));
const services_1 = require("../services");
class StudentsController {
    constructor() { }
    // -- Register a new Student --
    static register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const studentData = yield (0, services_1.registerStudent)(req.body);
                if (!studentData.result)
                    return controllers_handler_1.default.badRequest(studentData.message, res);
                return controllers_handler_1.default.created('Student created', studentData.student, res);
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
                    return controllers_handler_1.default.notFound('Student not updated.', res);
                return controllers_handler_1.default.ok('Student updated successfully.', res);
            }
            catch (err) {
                next(err);
            }
        });
    }
    // -- Update many Students -- Only courseId
    static updateMany(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { studentIds, courseId } = req.body;
            try {
                const result = yield (0, services_1.updateManyStudents)(studentIds, courseId);
                if (!result)
                    return controllers_handler_1.default.notFound('Students not updated.', res);
                return controllers_handler_1.default.ok('Students updated successfully.', res);
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
                    return controllers_handler_1.default.notFound('Students not found', res);
                return controllers_handler_1.default.ok('Students found', res, students);
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
                return controllers_handler_1.default.badRequest('File and column name and surname are required', res);
            }
            try {
                const students = yield (0, services_1.registerStudentsWithExcel)(req.file, req.body);
                return controllers_handler_1.default.ok('Students imported successfully.', res, students);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = StudentsController;
