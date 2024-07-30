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
exports.loginUser = void 0;
const postgre_dao_1 = __importDefault(require("../../dao/postgre.dao"));
const user_helper_1 = require("../../helpers/user.helper");
const memory_storage_1 = __importDefault(require("../../storage/memory.storage"));
function loginUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const remainingLoginAttempts = memory_storage_1.default.addLoginAttempt(user.email);
            if (remainingLoginAttempts === -1) {
                throw new Error("Too many attempts. Please try again later.");
            }
            const postgreDAOInstance = yield postgre_dao_1.default.getInstance();
            const result = yield postgreDAOInstance.getFromTable("users", { email: user.email, active: true });
            if (result.length === 0)
                throw new Error("Password or email incorrect, login attempts remaining: " + remainingLoginAttempts);
            const passwordMatch = user_helper_1.UserHelper.comparePassword(user.password, result[0].password);
            if (!passwordMatch)
                throw new Error("Password or email incorrect, login attempts remaining: " + remainingLoginAttempts);
            memory_storage_1.default.deleteLoginAttempts(user.email);
            const token = user_helper_1.UserHelper.generateToken(result[0]);
            return { userData: Object.assign(Object.assign({}, result[0]), { password: null }), token };
        }
        catch (err) {
            throw err;
        }
    });
}
exports.loginUser = loginUser;
