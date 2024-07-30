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
const user_dto_1 = __importDefault(require("../dto/user.dto"));
const services_1 = require("../services");
class UsersController {
    constructor() { }
    // -- Register a new user --
    static register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error, value } = user_dto_1.default.register(req.body, req.user);
            if (error) {
                return res.status(httpStatusCodes_1.default.BAD_REQUEST).json({
                    success: false, message: error.message
                });
            }
            try {
                const userData = yield (0, services_1.registerUser)(value);
                return res.status(httpStatusCodes_1.default.CREATED).json({
                    result: true,
                    message: 'User created successfully. Please check your email to activate your account.',
                    user: userData
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    // -- Login a user --
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error, value } = user_dto_1.default.login(req.body);
            if (error) {
                return res.status(httpStatusCodes_1.default.BAD_REQUEST).json({
                    success: false, message: error.message
                });
            }
            try {
                const { userData, token } = yield (0, services_1.loginUser)(value);
                return res.status(httpStatusCodes_1.default.OK).json({
                    result: true,
                    message: 'User logged in successfully.',
                    user: userData,
                    token
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    // -- Confirm email with code --
    static confirm(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code } = req.params;
            try {
                const result = yield (0, services_1.activeUser)(code);
                if (result) {
                    return res.status(httpStatusCodes_1.default.OK).json({
                        result: true,
                        message: 'User activated successfully.'
                    });
                }
                return res.status(httpStatusCodes_1.default.NOT_FOUND).json({
                    result: false,
                    message: 'User not found.'
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    // -- Forgot password --
    static forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error, value } = user_dto_1.default.forgotPassword(req.body);
            if (error) {
                return res.status(httpStatusCodes_1.default.BAD_REQUEST).json({
                    success: false, message: error.message
                });
            }
            try {
                yield (0, services_1.forgotPassword)(value);
                return res.status(httpStatusCodes_1.default.OK).json({
                    result: true,
                    message: 'Email sent'
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    // -- Reset password --
    static resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error, value } = user_dto_1.default.resetPassword(req.body);
            if (error) {
                return res.status(httpStatusCodes_1.default.BAD_REQUEST).json({
                    success: false, message: error.message
                });
            }
            try {
                const result = yield (0, services_1.resetPassword)(value);
                if (result) {
                    return res.status(httpStatusCodes_1.default.OK).json({
                        result: true,
                        message: 'Password changed successfully.'
                    });
                }
                return res.status(httpStatusCodes_1.default.NOT_FOUND).json({
                    result: false,
                    message: 'User not found.'
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
    // -- Update user --
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error, value } = user_dto_1.default.updateUser(req.body, req.user);
            if (error) {
                return res.status(httpStatusCodes_1.default.BAD_REQUEST).json({
                    success: false, message: error.message
                });
            }
            try {
                const result = yield (0, services_1.updateUser)(value);
                if (result) {
                    return res.status(httpStatusCodes_1.default.OK).json({
                        result: true,
                        message: 'User updated successfully.'
                    });
                }
                return res.status(httpStatusCodes_1.default.NOT_FOUND).json({
                    result: false,
                    message: 'User not found.'
                });
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = UsersController;
