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
exports.resetPassword = void 0;
const postgre_dao_1 = __importDefault(require("../../dao/postgre.dao"));
const memory_storage_1 = __importDefault(require("../../storage/memory.storage"));
function resetPassword(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email, password, code } = user;
            const savedCode = memory_storage_1.default.getCodeWithEmail(email);
            if (savedCode === code) {
                const postgreDAOInstance = yield postgre_dao_1.default.getInstance();
                const result = yield postgreDAOInstance.updateTable('users', { password }, { email });
                if (result > 0) {
                    memory_storage_1.default.deleteVerificationCode(email);
                    return true;
                }
            }
            throw new Error('User not found');
        }
        catch (err) {
            throw err;
        }
    });
}
exports.resetPassword = resetPassword;
