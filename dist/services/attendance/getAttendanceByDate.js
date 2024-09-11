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
export function getAttendanceByDate(date, course_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const postgreDAOInstance = yield PostgreDAO.getInstance();
            const result = yield postgreDAOInstance.executeQuery(query, [date, course_id]);
            return result.rows;
        }
        catch (err) {
            throw err;
        }
    });
}
const query = `
  SELECT
    s.id,
    s.name,
    s.surname,
    s.course_id,
    a.date,
    CASE 
      WHEN a.student_id IS NOT NULL THEN true 
      ELSE false 
      END AS attended  
  FROM students s
  LEFT JOIN attendances a ON s.id = a.student_id AND a.date::date = $1
  WHERE ($2::INT IS NULL OR s.course_id = $2)
`;
