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
export function getNonAttendance(studentId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const postgreDAOInstance = yield PostgreDAO.getInstance();
            const whereQuery = { student_id: studentId };
            const selectQuery = ['id', 'date', 'student_id', 'subject_id', 'course_id', 'type'];
            const result = yield postgreDAOInstance.getFromTable("nonattendances", whereQuery, selectQuery);
            return result;
        }
        catch (err) {
            throw err;
        }
    });
}
