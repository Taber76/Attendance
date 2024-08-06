var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import PostgreDAO from "../../dao/postgre.dao.js";
import { UserHelper } from "../../helpers/user.helper.js";
import MemoryStorage from "../../storage/memory.storage.js";
export function loginUser(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const remainingLoginAttempts = MemoryStorage.addLoginAttempt(user.email);
            if (remainingLoginAttempts === -1) {
                throw new Error("Too many attempts. Please try again later.");
            }
            const postgreDAOInstance = yield PostgreDAO.getInstance();
            const result = yield postgreDAOInstance.getFromTable("users", { email: user.email, active: true });
            if (result.length === 0)
                throw new Error("Password or email incorrect, login attempts remaining: " + remainingLoginAttempts);
            const passwordMatch = UserHelper.comparePassword(user.password, result[0].password);
            if (!passwordMatch)
                throw new Error("Password or email incorrect, login attempts remaining: " + remainingLoginAttempts);
            MemoryStorage.deleteLoginAttempts(user.email);
            const token = UserHelper.generateToken(result[0]);
            return { userData: Object.assign(Object.assign({}, result[0]), { password: null }), token };
        }
        catch (err) {
            throw err;
        }
    });
}
