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
    // -- Register a new Course --
    static register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseData = yield (0, services_1.registerCourse)(req.body);
                if (!courseData.result)
                    return this.badRequest(courseData.message, res);
                return this.created('Course created', courseData.course, res);
            }
            catch (err) {
                next(err);
            }
        });
    }
    // -- Update a Student --
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const course_id = parseInt(req.params.course_id);
            try {
                const result = yield (0, services_1.updateCourse)(Object.assign(Object.assign({}, req.body), { id: course_id }));
                if (!result)
                    return this.notFound('Course not updated.', res);
                return this.ok('Course updated successfully.', res);
            }
            catch (err) {
                next(err);
            }
        });
    }
    // -- Get course/s --
    static getCourses(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseId = req.params.course_id ? parseInt(req.params.course_id) : null;
                const active = courseId === 0 ? false : true;
                const courses = yield (0, services_1.getCourses)(courseId, active);
                if (!courses)
                    return this.notFound('Courses not found', res);
                return this.ok('Courses found', res, courses);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = UsersController;
