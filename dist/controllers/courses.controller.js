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
class CoursesController {
    constructor() { }
    // -- Register a new Course --
    static register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseData = yield (0, services_1.registerCourse)(req.body);
                if (!courseData.result)
                    return controllers_handler_1.default.badRequest(courseData.message, res);
                return controllers_handler_1.default.created('Course created', courseData.course, res);
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
                    return controllers_handler_1.default.notFound('Course not updated.', res);
                return controllers_handler_1.default.ok('Course updated successfully.', res);
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
                if (!courses || courses.length === 0)
                    return controllers_handler_1.default.notFound('Courses not found', res);
                return controllers_handler_1.default.ok('Courses found', res, courses);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = CoursesController;
