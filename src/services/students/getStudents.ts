import PostgreDAO from "../../dao/postgre.dao.js";
import { StudentAttributes } from "../../types/index.js";


export async function getStudents(studentId: number | null, active: boolean, course_id?: number | null) {
  try {
    const postgreDAOInstance = await PostgreDAO.getInstance();
    const whereQuery: any = { active };
    if (course_id) whereQuery['course_id'] = course_id;
    const selectQuery: (keyof StudentAttributes)[] = ['id', 'name', 'surname', 'contact_phone', 'contact_email', 'birthdate', 'personal_id', 'active', 'course_id', 'createdAt', 'updatedAt'];
    if (studentId) whereQuery['id'] = studentId;

    const result = await postgreDAOInstance.getFromTable<StudentAttributes>(
      "students",
      whereQuery,
      selectQuery
    );

    return result
  } catch (err) {
    throw err;
  }
}