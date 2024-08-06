import PostgreDAO from "../../dao/postgre.dao.js";
import { CourseUpdateAttributes } from "../../types/index.js";

export async function updateCourse(courseData: CourseUpdateAttributes) {
  try {
    const postgreDAOInstance = await PostgreDAO.getInstance();
    const courseUpdated = await postgreDAOInstance.updateTable<CourseUpdateAttributes>(
      'courses',
      courseData,
      { id: courseData.id }
    )
    if (courseUpdated > 0) {
      return true;
    }
    throw new Error('Course not updated');
  } catch (err) {
    throw err;
  }
}