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
exports.registerUser = void 0;
const postgre_dao_1 = __importDefault(require("../../dao/postgre.dao"));
const email_handler_1 = require("../../handlers/email.handler");
const user_helper_1 = require("../../helpers/user.helper");
const memory_storage_1 = __importDefault(require("../../storage/memory.storage"));
function registerUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const postgreDAOInstance = yield postgre_dao_1.default.getInstance();
            const existingUser = yield postgreDAOInstance.getFromTable("users", { email: user.email });
            if (existingUser.length > 0)
                throw new Error("User already exists");
            const registeredUser = yield postgreDAOInstance.insertIntoTable("users", user);
            if (!registeredUser)
                throw new Error("Unable to register user");
            const verificationCode = user_helper_1.UserHelper.createCode();
            memory_storage_1.default.addVerificationCode(user.email, verificationCode);
            const emailSent = yield email_handler_1.EmailHandler.sendVerificationEmail(user.email, user.fullname, verificationCode);
            if (!emailSent)
                throw new Error("User registration successful, but unable to send verification email");
            return registeredUser;
        }
        catch (err) {
            throw err;
        }
    });
}
exports.registerUser = registerUser;
