"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const prisma_client_js_1 = require("../config/prisma.client.js");
const bcrypt = __importStar(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const email_handler_js_1 = __importDefault(require("../handlers/email.handler.js"));
const email_templates_js_1 = __importDefault(require("../templates/email.templates.js"));
const user_helper_js_1 = __importDefault(require("../helpers/user.helper.js"));
const environment_js_1 = require("../config/environment.js");
const passwordSalt = bcrypt.genSaltSync(environment_js_1.bcrypt_rounds);
var Roles;
(function (Roles) {
    Roles["ADMIN"] = "ADMIN";
    Roles["USER"] = "USER";
    Roles["TEACHER"] = "TEACHER";
})(Roles || (Roles = {}));
const UsersController = {
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                result: false,
                message: 'Email and password are required'
            });
        }
        try {
            const remainingAttempts = yield user_helper_js_1.default.getLoginAttempts(email);
            if (remainingAttempts === -1) {
                return res.status(401).json({
                    result: false,
                    message: 'Too many attempts. Please try again later.'
                });
            }
            const user = yield prisma_client_js_1.prisma.user.findUnique({
                where: {
                    email,
                    active: true
                },
            });
            if (!user) {
                return res.status(404).json({
                    result: false,
                    message: 'User not found or not activated.',
                });
            }
            const passwordMatch = yield bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(401).json({
                    result: false,
                    message: 'Incorrect password.',
                    remainingAttempts
                });
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id }, environment_js_1.JWT_SECRET, { expiresIn: "36000s" });
            user_helper_js_1.default.deleteLoginAttempts(email);
            return res.status(200).json({
                token,
                result: true,
                user: Object.assign(Object.assign({}, user), { password: null }),
            });
        }
        catch (error) {
            return res.status(500).json({
                result: false,
                message: 'Internal server error.'
            });
        }
    }),
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, fullname, username, password } = req.body;
            if (!email || !fullname || !username || !password) {
                return res.status(400).json({
                    message: 'All fields are required.',
                    result: false
                });
            }
            let user = yield prisma_client_js_1.prisma.user.findFirst({
                where: {
                    OR: [
                        { email: email },
                        { username: username }
                    ]
                },
            });
            if (user) {
                return res.status(401).json({
                    result: false,
                    message: 'Email or username already exists.',
                });
            }
            if (!user_helper_js_1.default.isValidEmail(email) || !user_helper_js_1.default.isValidPassword(password)) {
                return res.status(400).json({
                    result: false,
                    message: 'Invalid email or password less than 8 characters.',
                });
            }
            const hashPassword = yield bcrypt.hash(password, passwordSalt);
            const data = {
                email,
                fullname,
                username,
                password: hashPassword,
                active: false
            };
            if (req.user)
                data.active = true;
            user = yield prisma_client_js_1.prisma.user.create({ data });
            const code = yield user_helper_js_1.default.getEmailSendCode(email);
            if (user) {
                const template = yield email_templates_js_1.default.confirmEmail(email, fullname, code);
                const emailResponse = yield (0, email_handler_js_1.default)(template);
                if (emailResponse.result) {
                    return res.status(201).json({
                        result: true,
                        message: 'User created successfully. User will check email to get the confirmation code to activate the account.',
                        user: Object.assign(Object.assign({}, user), { password: null }),
                    });
                }
                return res.status(400).json({
                    result: false,
                    message: 'Confirmation email not sent.',
                });
            }
            return res.status(400).json({
                result: false,
                message: 'User not created.',
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                result: false,
                message: 'Internal server error',
            });
        }
    }),
    // Confirmacion de cuenta: recibe code que fue enviado por email
    confirm: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { code } = req.params;
            if (!code) {
                return res.status(400).json({
                    result: false,
                    message: 'Code is required.',
                });
            }
            const checkEmailCode = yield user_helper_js_1.default.checkEmailCode(code);
            if (!checkEmailCode.success) {
                return res.status(400).json({
                    result: false,
                    message: checkEmailCode.message
                });
            }
            const user = yield prisma_client_js_1.prisma.user.update({
                where: {
                    email: checkEmailCode.email
                },
                data: {
                    active: true
                }
            });
            return res.status(200).json({
                result: true,
                message: 'Email confirmed successfully.',
                user: Object.assign(Object.assign({}, user), { password: null })
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                result: false,
                message: 'Internal server error',
            });
        }
    }),
    // Recuperacion de contraseña: envia email para recuperar la contraseña
    forgotPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const email = req.body.email;
            if (!email) {
                return res.status(400).json({
                    result: false,
                    message: 'Email is required.'
                });
            }
            const user = yield prisma_client_js_1.prisma.user.findUnique({ where: { email } });
            if (user === null) {
                return res.status(404).json({
                    result: false,
                    message: 'User not found.'
                });
            }
            const code = yield user_helper_js_1.default.getEmailSendCode(email);
            const template = yield email_templates_js_1.default.forgotPassword(email, code);
            const emailResponse = yield (0, email_handler_js_1.default)(template);
            if (!emailResponse.result) {
                return res.status(400).json({
                    result: false,
                    message: 'Email not sent',
                });
            }
            return res.status(200).json({
                result: true,
                message: 'Email sent',
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                result: false,
                message: 'Internal server error'
            });
        }
    }),
    // Recupera la contraseña: recibe code y nueva contraseña.
    resetPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, code, password } = req.body;
            if (!email || !code || !password) {
                return res.status(400).json({
                    result: false,
                    message: 'Email, code and password are required!'
                });
            }
            const checkEmailCode = yield user_helper_js_1.default.checkEmailCode(code);
            if (!checkEmailCode.success) {
                return res.status(400).json({
                    result: false,
                    message: checkEmailCode.message
                });
            }
            if (checkEmailCode.email !== email) {
                return res.status(400).json({
                    result: false,
                    message: 'Invalid email.'
                });
            }
            const hashPassword = yield bcrypt.hash(password, passwordSalt);
            const user = yield prisma_client_js_1.prisma.user.update({
                where: {
                    email: checkEmailCode.email
                },
                data: {
                    password: hashPassword
                }
            });
            return res.status(200).json({
                result: true,
                message: 'Password updated successfully',
                user: Object.assign(Object.assign({}, user), { password: null })
            });
        }
        catch (error) {
            console.log(error);
            return res.status(500).json({
                result: false,
                message: 'Internal server error'
            });
        }
    }),
    getUsers: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const users = yield prisma_client_js_1.prisma.user.findMany({
                where: {
                //active: true
                },
                select: {
                    id: true,
                    fullname: true,
                    username: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    active: true
                }
            });
            if (users) {
                return res.status(200).json({
                    result: true,
                    message: 'Users found',
                    users
                });
            }
            return res.status(404).json({
                result: false,
                message: 'Users not found'
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                result: false,
                message: 'Internal server error'
            });
        }
    }),
    getById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = parseInt(req.params.user_id);
        if (!id) {
            return res.status(400).json({
                result: false,
                message: 'Id is required',
            });
        }
        try {
            const user = yield prisma_client_js_1.prisma.user.findUnique({
                where: {
                    id: id
                },
                select: {
                    id: true,
                    fullname: true,
                    username: true,
                    email: true,
                    role: true,
                    createdAt: true,
                    active: true
                }
            });
            if (user) {
                return res.status(200).json({
                    result: true,
                    message: 'User found.',
                    user
                });
            }
            return res.status(404).json({
                result: false,
                message: 'User not found.',
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                result: false,
                message: 'Internal server error'
            });
        }
    }),
    delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = parseInt(req.params.user_id);
        if (!id) {
            return res.status(400).json({
                result: false,
                message: 'Id is required',
            });
        }
        try {
            const user = yield prisma_client_js_1.prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    active: false,
                    updatedAt: new Date()
                },
            });
            if (user) {
                return res.status(200).json({
                    result: true,
                    message: 'User deleted successfully',
                    user,
                });
            }
        }
        catch (error) {
            console.log(error);
            let message = 'Internal server error';
            if (error.code === 'P2025') {
                message = 'User not found';
            }
            res.status(500).json({
                result: false,
                message: message
            });
        }
    }),
    assignRole: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = parseInt(req.params.user_id);
        const { role } = req.body;
        if (!id) {
            return res.status(400).json({
                result: false,
                message: 'Id is required',
            });
        }
        if (!role) {
            return res.status(400).json({
                result: false,
                message: 'Role field is required',
            });
        }
        if (!(role in Roles)) {
            return res.status(400).json({
                result: false,
                message: `${role} is not an assignable role`,
            });
        }
        try {
            const user = yield prisma_client_js_1.prisma.user.update({
                where: {
                    id: id,
                },
                data: {
                    role: role,
                    updatedAt: new Date()
                },
            });
            if (user) {
                return res.status(200).json({
                    result: true,
                    message: 'Role successfully assigned',
                    user,
                });
            }
        }
        catch (error) {
            let message = 'Internal server error';
            if (error.code === 'P2025') {
                message = 'User not found';
            }
            res.status(500).json({
                result: false,
                message: message
            });
        }
    }),
    update: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = parseInt(req.user.id);
        const { user_id, fullname, username, email, password } = req.body;
        if (!user_id) {
            return res.status(400).json({
                result: false,
                message: 'User id is required.',
            });
        }
        if (!fullname && !username && !email && !password) {
            return res.status(400).json({
                result: false,
                message: 'At least one field must be updated.',
            });
        }
        try {
            const user = yield prisma_client_js_1.prisma.user.findUnique({
                where: {
                    id: id,
                },
            });
            if (!user) {
                return res.status(400).json({
                    result: false,
                    message: 'User not found',
                });
            }
            let updatedUser = {};
            const updatedData = {};
            if (fullname)
                updatedData.fullname = fullname;
            if (username)
                updatedData.username = username;
            if (email)
                updatedData.email = email;
            if (password)
                updatedData.password = yield bcrypt.hash(password, passwordSalt);
            ;
            if (user.role !== 'ADMIN' && user_id !== id) {
                return res.status(400).json({
                    result: false,
                    message: 'You are not authorized to update this user.',
                });
            }
            updatedUser = yield prisma_client_js_1.prisma.user.update({ where: { id: user_id }, data: updatedData });
            if (email) {
                const code = yield user_helper_js_1.default.getEmailSendCode(email);
                const template = yield email_templates_js_1.default.confirmEmail(email, fullname, code);
                const emailResponse = yield (0, email_handler_js_1.default)(template);
                if (!emailResponse.result) {
                    return res.status(500).json({
                        result: false,
                        message: 'Verification email could not be sent.',
                    });
                }
            }
            return res.status(202).json({
                result: true,
                message: 'User updated successfully',
                updated: Object.assign(Object.assign({}, updatedUser), { password: undefined }),
            });
        }
        catch (error) {
            res.status(500).json({
                result: false,
                message: 'Internal server error'
            });
        }
    }),
    updateByAdmin: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const user_id = parseInt(req.params.user_id);
        const { fullname, username, email, password, role, active } = req.body;
        if (!user_id) {
            return res.status(400).json({
                result: false,
                message: 'User id is required.',
            });
        }
        if (!fullname && !username && !email && !role && !active && !password) {
            return res.status(400).json({
                result: false,
                message: 'At least one field is required',
            });
        }
        try {
            const updated = {};
            if (fullname)
                updated.fullname = fullname;
            if (username)
                updated.username = username;
            if (role) {
                if (!(role in Roles))
                    return res.status(400).json({
                        result: false,
                        message: `${role} is not an assignable role, please choose one of the following: ${Object.values(Roles).join(', ')}`
                    });
                else
                    updated.role = role;
            }
            if (email)
                updated.email = email;
            if (password)
                updated.password = yield bcrypt.hash(password, passwordSalt);
            if (active)
                updated.active = active;
            const updatedUser = yield prisma_client_js_1.prisma.user.update({
                where: {
                    id: user_id,
                },
                data: Object.assign(Object.assign({}, updated), { updatedAt: new Date() }),
            });
            // falta enviar notificacion por email al usuario
            return res.status(202).json({
                result: true,
                message: 'User updated successfully',
                updated: Object.assign(Object.assign({}, updatedUser), { password: null })
            });
        }
        catch (error) {
            res.status(500).json({
                result: false,
                message: 'Internal server error'
            });
        }
    }),
    updateEmail: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const { token, email } = req.params;
        if (!token) {
            return res.status(400).json({
                result: false,
                message: 'Token is required',
            });
        }
        if (!email) {
            return res.status(400).json({
                result: false,
                message: 'Email is required',
            });
        }
        try {
            const decodedToken = jsonwebtoken_1.default.verify(token, environment_js_1.JWT_SECRET);
            const userUpdated = yield prisma_client_js_1.prisma.user.update({
                where: {
                    email: (decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken.email) || 'email', // <---------------------------------- ARREGLAR
                },
                data: {
                    email: email,
                    updatedAt: new Date()
                },
            });
            if (userUpdated) {
                return res.status(202).json({
                    result: true,
                    message: 'Email updated successfully',
                });
            }
            res.status(500).json({
                result: false,
                message: 'Internal server error'
            });
        }
        catch (error) {
            res.status(500).json({
                result: false,
                message: 'Internal server error'
            });
        }
    }),
};
exports.default = UsersController;
