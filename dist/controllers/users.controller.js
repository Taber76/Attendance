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
    static ok(message, res, data, token) {
        const response = { result: true, message };
        if (data)
            response.data = data;
        if (token)
            response.token = token;
        return res.status(httpStatusCodes_1.default.OK).json(response);
    }
    static created(message, data, res) {
        return res.status(httpStatusCodes_1.default.CREATED).json({
            result: true,
            message,
            data
        });
    }
    static badRequest(message, res) {
        return res.status(httpStatusCodes_1.default.BAD_REQUEST).json({
            result: false,
            message
        });
    }
    static notFound(message, res) {
        return res.status(httpStatusCodes_1.default.NOT_FOUND).json({
            result: false,
            message
        });
    }
    // -- Register a new user --
    static register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error, value } = user_dto_1.default.register(req.body, req.user);
            if (error)
                return this.badRequest(error.message, res);
            try {
                const userData = yield (0, services_1.registerUser)(value);
                return this.created('User created successfully. Please check your email to activate your account.', userData, res);
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
            if (error)
                return this.badRequest(error.message, res);
            try {
                const { userData, token } = yield (0, services_1.loginUser)(value);
                return this.ok('User logged in successfully.', res, userData, token);
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
                if (result)
                    return this.ok('User activated successfully.', res);
                return this.notFound('User not found.', res);
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
            if (error)
                return this.badRequest(error.message, res);
            try {
                yield (0, services_1.forgotPassword)(value);
                return this.ok('Email sent', res);
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
            if (error)
                return this.badRequest(error.message, res);
            try {
                const result = yield (0, services_1.resetPassword)(value);
                if (result)
                    return this.ok('Password changed successfully.', res);
                return this.notFound('User not found.', res);
            }
            catch (err) {
                next(err);
            }
        });
    }
    // -- Update user --
    static update(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.params.user_id ? { id: req.params.user_id } : req.user;
            const { error, value } = user_dto_1.default.updateUser(req.body, user);
            if (error)
                return this.badRequest(error.message, res);
            try {
                const result = yield (0, services_1.updateUser)(value);
                if (result)
                    return this.ok('User updated successfully.', res);
                return this.notFound('User not found.', res);
            }
            catch (err) {
                next(err);
            }
        });
    }
    // -- Get user/s --
    static getUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.user_id ? parseInt(req.params.user_id) : null;
                const users = yield (0, services_1.getUsers)(userId);
                if (users)
                    return this.ok('Users found', res, users);
                return this.notFound('Users not found.', res);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
exports.default = UsersController;
