import PostgreDAO from "../../dao/postgre.dao.js";
import { StudentUpdateAttributes } from "../../types/index.js";

export async function updateStudent(studentData: StudentUpdateAttributes) {
  try {
    const postgreDAOInstance = await PostgreDAO.getInstance();
    const studentUpdated = await postgreDAOInstance.updateTable<StudentUpdateAttributes>(
      'students',
      studentData,
      { id: studentData.id }
    )
    if (studentUpdated > 0) {
      return true;
    }
    throw new Error('User not updated');
  } catch (err) {
    throw err;
  }
}