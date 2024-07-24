"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_mid_js_1 = __importDefault(require("../middlewares/auth.mid.js"));
const users_controller_old_js_1 = __importDefault(require("../controllers/users.controller.old.js"));
const users_controller_js_1 = __importDefault(require("../controllers/users.controller.js"));
exports.usersRouter = express_1.default
    .Router() // Path: /api/users
    // -- Not protected routes --
    .get('/confirm/:code', users_controller_old_js_1.default.confirm)
    .post('/login', users_controller_old_js_1.default.login)
    .post('/register', users_controller_js_1.default.register)
    .post('/forgotpassword', users_controller_old_js_1.default.forgotPassword)
    .post('/resetpassword', users_controller_old_js_1.default.resetPassword)
    // -- User protected routes --
    .use(auth_mid_js_1.default.authenticate('userJWT', { session: false }))
    .put('/update', users_controller_old_js_1.default.update);
// -- Admin protected routes --
const adminProtectedRoutes = express_1.default.Router()
    .use(auth_mid_js_1.default.authenticate('adminJWT', { session: false }))
    .get('/', users_controller_old_js_1.default.getUsers)
    .get('/:user_id', users_controller_old_js_1.default.getById)
    .post('/admin/register', users_controller_old_js_1.default.register)
    .put('/assignrole/:user_id', users_controller_old_js_1.default.assignRole)
    .put('/update/:user_id', users_controller_old_js_1.default.updateByAdmin)
    .delete('/delete/:user_id', users_controller_old_js_1.default.delete);
exports.usersRouter.use(adminProtectedRoutes);
