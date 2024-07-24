"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.coursesRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_mid_js_1 = __importDefault(require("../middlewares/auth.mid.js"));
const courses_controller_js_1 = __importDefault(require("../controllers/courses.controller.js"));
exports.coursesRouter = express_1.default
    .Router() // Path: /api/courses
    // -- Middlewares --
    .use(auth_mid_js_1.default.authenticate('adminJWT', { session: false }))
    // -- Routes --
    .get('/', courses_controller_js_1.default.getAll)
    .get('/deleted', courses_controller_js_1.default.getDeleted)
    .post('/register', courses_controller_js_1.default.create)
    .put('/update/:course_id', courses_controller_js_1.default.update)
    .put('/addsubjects/:course_id', courses_controller_js_1.default.addSubjects)
    .put('/restore/:course_id', courses_controller_js_1.default.restore)
    .delete('/delete/:course_id', courses_controller_js_1.default.delete);
