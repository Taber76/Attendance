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
import UserDTO from "../dto/user.dto.js";
import { registerUser, loginUser, activeUser, forgotPassword, resetPassword, updateUser, getUsers, } from "../services/index.js";
export default class UsersController {
    constructor() { }
    // -- Register a new user --
    static register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error, value } = UserDTO.register(req.body, req.user);
            if (error)
                return ControllerHandler.badRequest(error.message, res);
            try {
                const userData = yield registerUser(value);
                return ControllerHandler.created('User created successfully. Please check your email to activate your account.', userData, res);
            }
            catch (err) {
                next(err);
            }
        });
    }
    // -- Login a user --
    static login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error, value } = UserDTO.login(req.body);
            if (error)
                return ControllerHandler.badRequest(error.message, res);
            try {
                const { userData, token } = yield loginUser(value);
                return ControllerHandler.ok('User logged in successfully.', res, userData, token);
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
                const result = yield activeUser(code);
                if (result)
                    return ControllerHandler.ok('User activated successfully.', res);
                return ControllerHandler.notFound('User not found.', res);
            }
            catch (err) {
                next(err);
            }
        });
    }
    // -- Forgot password --
    static forgotPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error, value } = UserDTO.forgotPassword(req.body);
            if (error)
                return ControllerHandler.badRequest(error.message, res);
            try {
                yield forgotPassword(value);
                return ControllerHandler.ok('Email sent', res);
            }
            catch (err) {
                next(err);
            }
        });
    }
    // -- Reset password --
    static resetPassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error, value } = UserDTO.resetPassword(req.body);
            if (error)
                return ControllerHandler.badRequest(error.message, res);
            try {
                const result = yield resetPassword(value);
                if (result)
                    return ControllerHandler.ok('Password changed successfully.', res);
                return ControllerHandler.notFound('User not found.', res);
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
            const { error, value } = UserDTO.updateUser(req.body, user);
            if (error)
                return ControllerHandler.badRequest(error.message, res);
            try {
                const result = yield updateUser(value);
                if (result)
                    return ControllerHandler.ok('User updated successfully.', res);
                return ControllerHandler.notFound('User not found.', res);
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
                const users = yield getUsers(userId);
                if (users)
                    return ControllerHandler.ok('Users found', res, users);
                return ControllerHandler.notFound('Users not found.', res);
            }
            catch (err) {
                next(err);
            }
        });
    }
}
