import PostgreDAO from "../../dao/postgre.dao.js";
import { StudentAttributes } from "../../types/index.js";


export async function getStudents(studentId: number | null, active: boolean, courseId?: number | null) {
  try {
    const postgreDAOInstance = await PostgreDAO.getInstance();
    const whereQuery: any = { active };
    if (courseId) whereQuery['courseId'] = courseId;
    const selectQuery: (keyof StudentAttributes)[] = ['id', 'name', 'surname', 'contact_phone', 'contact_email', 'birthdate', 'personal_id', 'active', 'courseId', 'createdAt', 'updatedAt'];
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