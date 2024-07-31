import PostgreDAO from "../../dao/postgre.dao";
import { StudentCreationAttributes } from "../../types";


export async function registerStudent(student: StudentCreationAttributes) {
  try {
    const postgreDAOInstance = await PostgreDAO.getInstance();

    const existingStudentArray = await postgreDAOInstance.getFromTable<StudentCreationAttributes>(
      "students",
      {
        name: student.name,
        surname: student.surname
      }
    );

    if (existingStudentArray.length > 0) {
      for (const existingStudent of existingStudentArray) {
        if (
          existingStudent.internal_id == student.internal_id &&
          existingStudent.personal_id == student.personal_id
        ) {
          return {
            message: `Student with this name: ${student.name}, surname: ${student.surname}, internal_id: ${student.internal_id} and personal_id: ${student.personal_id} already exists`
          };
        }
      }
    }

    const registeredStudent = await postgreDAOInstance.insertIntoTable<StudentCreationAttributes>(
      "students",
      student
    );
    if (!registeredStudent) throw new Error("Unable to register student");

    return {
      message: "Student created",
      result: true,
      student: registeredStudent[0]
    }
  } catch (err) {
    throw err;
  }
}