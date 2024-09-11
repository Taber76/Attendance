"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subjectsRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_mid_js_1 = __importDefault(require("../middlewares/auth.mid.js"));
const subjects_controller_js_1 = __importDefault(require("../controllers/subjects.controller.js"));
exports.subjectsRouter = express_1.default
    .Router() // Path: /api/subjects
    // -- Middlewares --
    .use(auth_mid_js_1.default.authenticate('adminJWT', { session: false }))
    // -- Routes --
    .get('/', subjects_controller_js_1.default.getAll) // '/subjects' para traer todos los subjects y '/subjects?course_id=4' para traer los subjects filtadas por course
    .post('/register', subjects_controller_js_1.default.create)
    .put('/update/:subject_id', subjects_controller_js_1.default.update)
    .put('/addstudents/:subject_id', subjects_controller_js_1.default.addStudents)
    .delete('/delete/:subject_id', subjects_controller_js_1.default.delete);
