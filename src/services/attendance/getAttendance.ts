import PostgreDAO from "../../dao/postgre.dao.js";
import { NonAttendanceAttributes } from "../../types/index.js";

export async function getNonAttendance(studentId: number) {
  try {
    const postgreDAOInstance = await PostgreDAO.getInstance();
    const whereQuery = { student_id: studentId };
    const selectQuery: (keyof NonAttendanceAttributes)[] = ['id', 'date', 'student_id', 'subject_id', 'course_id', 'type'];
    const result = await postgreDAOInstance.getFromTable<NonAttendanceAttributes>(
      "nonattendances",
      whereQuery,
      selectQuery
    );

    return result
  } catch (err) {
    throw err;
  }
}