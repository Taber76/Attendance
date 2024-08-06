import PostgreDAO from "../../dao/postgre.dao.js";
import { CourseCreationAttributes } from "../../types/index.js";


export async function registerCourse(course: CourseCreationAttributes) {
  try {
    const postgreDAOInstance = await PostgreDAO.getInstance();

    const existingCourse = await postgreDAOInstance.getFromTable<CourseCreationAttributes>(
      "courses",
      {
        level: course.level,
        number: course.number,
        letter: course.letter
      }
    );

    if (existingCourse.length > 0) return {
      message: `Course with level: ${course.level}, number: ${course.number} and letter: ${course.letter} already exists`
    };

    const registeredCourse = await postgreDAOInstance.insertIntoTable<CourseCreationAttributes>(
      "courses",
      course
    );
    if (!registeredCourse) throw new Error("Unable to register course");

    return {
      message: "Course created",
      result: true,
      course: registeredCourse[0]
    }
  } catch (err) {
    throw err;
  }
}