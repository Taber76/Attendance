"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usersRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_mid_js_1 = __importDefault(require("../middlewares/auth.mid.js"));
const users_controller_js_1 = __importDefault(require("../controllers/users.controller.js"));
exports.usersRouter = express_1.default
    .Router() // Path: /api/users
    // -- Not protected routes --
    .get('/confirm/:code', users_controller_js_1.default.confirm)
    .post('/login', users_controller_js_1.default.login) //ok
    .post('/register', users_controller_js_1.default.register) //ok
    .post('/forgotpassword', users_controller_js_1.default.forgotPassword)
    .post('/resetpassword', users_controller_js_1.default.resetPassword)
    // -- User protected routes --
    .use(auth_mid_js_1.default.authenticate('userJWT', { session: false }))
    .put('/update', users_controller_js_1.default.update);
// -- Admin protected routes --
const adminProtectedRoutes = express_1.default.Router()
    .use(auth_mid_js_1.default.authenticate('adminJWT', { session: false }))
    .get('/', users_controller_js_1.default.getUsers) //ok
    .get('/:user_id', users_controller_js_1.default.getUsers) //ok
    .post('/admin/register', users_controller_js_1.default.register) //ok
    .put('/update/:user_id', users_controller_js_1.default.update);
//.delete('/delete/:user_id', UsersControllerOLD.delete)
exports.usersRouter.use(adminProtectedRoutes);
