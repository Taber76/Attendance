import { updateStudent } from "./updateStudent.js";

export async function updateManyStudents(studentIds: number[], course_id: number) {
  try {
    const promises = studentIds.map(async (studentId) => {
      await updateStudent({ id: studentId, course_id });
    });
    await Promise.all(promises);

    return true;
  } catch (err) {
    throw err;
  }
}