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
import { getCourses, registerCourse, updateCourse, } from "../services/index.js";
export default class CoursesController {
    constructor() { }
    // -- Register a new Course --
    static register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const courseData = yield registerCourse(req.body);
                if (!courseData.result)
                    return ControllerHandler.badRequest(courseData.message, res);
                return ControllerHandler.created('Course created', courseData.course, res);
            }
            catch (err) {
                next(err);
            }
        });
    }
    // -- Update a Course --
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const course_id = parseInt(req.params.course_id);
            try {
                const result = yield updateCourse(Object.assign(Object.assign({}, req.body), { id: course_id }));
                if (!result)
                    return ControllerHandler.notFound('Course not updated.', res);
                return ControllerHandler.ok('Course updated successfully.', res);
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
                const course_id = req.params.course_id ? parseInt(req.params.course_id) : null;
                const active = course_id === 0 ? false : true;
                const courses = yield getCourses(course_id, active);
                if (!courses || courses.length === 0)
                    return ControllerHandler.notFound('Courses not found', res);
                return ControllerHandler.ok('Courses found', res, courses);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
