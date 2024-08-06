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
import MemoryStorage from "../../storage/memory.storage.js";
export function activeUser(code) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const email = MemoryStorage.getEmailWithCode(code);
            if (email) {
                const postgreDAOInstance = yield PostgreDAO.getInstance();
                const result = yield postgreDAOInstance.updateTable('users', { active: true }, { email: email });
                if (result > 0) {
                    MemoryStorage.deleteVerificationCode(email);
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
