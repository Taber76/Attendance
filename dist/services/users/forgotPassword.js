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
import { EmailHandler } from "../../handlers/email.handler.js";
import { UserHelper } from "../../helpers/user.helper.js";
import MemoryStorage from "../../storage/memory.storage.js";
export function forgotPassword(user) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { email } = user;
            const postgreDAOInstance = yield PostgreDAO.getInstance();
            const existingUser = yield postgreDAOInstance.getFromTable("users", { email: user.email });
            if (existingUser.length === 0)
                throw new Error("User not found");
            const verificationCode = UserHelper.createCode();
            MemoryStorage.addVerificationCode(email, verificationCode);
            const emailSent = yield EmailHandler.sendForgotPasswordEmail(email, verificationCode);
            if (!emailSent)
                throw new Error("Unable to send verification email");
            return Object.assign(Object.assign({}, existingUser[0]), { password: null });
        }
        catch (err) {
            throw err;
        }
    });
}
