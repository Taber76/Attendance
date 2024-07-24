"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentsRouter = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const auth_mid_js_1 = __importDefault(require("../middlewares/auth.mid.js"));
const students_controller_js_1 = __importDefault(require("../controllers/students.controller.js"));
exports.studentsRouter = express_1.default
    .Router() // Path: /api/students
    // -- Middlewares --
    .use(auth_mid_js_1.default.authenticate('userJWT', { session: false }))
    // -- Routes --
    .get('', students_controller_js_1.default.getStudents)
    .get('/deleted', students_controller_js_1.default.getDeleted)
    .post('/register', students_controller_js_1.default.register)
    .post('/excel-import', (0, multer_1.default)().single('file'), students_controller_js_1.default.excelImport)
    .put('/update/:student_id', students_controller_js_1.default.update)
    .put('/restore/:student_id', students_controller_js_1.default.restore)
    .delete('/delete/:student_id', students_controller_js_1.default.delete);
