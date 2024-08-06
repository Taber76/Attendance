import PostgreDAO from "../../dao/postgre.dao.js";
import { CourseAttributes } from "../../types/index.js";

export async function getCourses(courseId: number | null, active: boolean) {
  try {
    const postgreDAOInstance = await PostgreDAO.getInstance();
    const whereQuery: any = { active };
    const selectQuery: (keyof CourseAttributes)[] = ['id', 'level', 'number', 'letter', 'active', 'createdAt', 'updatedAt'];
    if (courseId) whereQuery['id'] = courseId;
    const result = await postgreDAOInstance.getFromTable<CourseAttributes>(
      "courses",
      whereQuery,
      selectQuery
    );

    return result
  } catch (err) {
    throw err;
  }
}