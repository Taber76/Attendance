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
export function registerAttendance(attendance) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const postgreDAOInstance = yield PostgreDAO.getInstance();
            const registeredAttendance = yield postgreDAOInstance.insertIntoTable("attendances", attendance);
            if (!registeredAttendance)
                throw new Error("Unable to register attendance");
            return {
                message: "Attendance registered",
                result: true,
                course: registeredAttendance[0]
            };
        }
        catch (err) {
            throw err;
        }
    });
}
