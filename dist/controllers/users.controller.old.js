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
const environment_js_1 = require("../config/environment.js");
const passwordSalt = bcrypt.genSaltSync(environment_js_1.BCRYPT_ROUNDS);
var Roles;
(function (Roles) {
    Roles["ADMIN"] = "ADMIN";
    Roles["USER"] = "USER";
    Roles["TEACHER"] = "TEACHER";
})(Roles || (Roles = {}));
const UsersController = {
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
