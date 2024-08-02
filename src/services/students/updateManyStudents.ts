import { updateStudent } from "./updateStudent";

export async function updateManyStudents(studentIds: number[], courseId: number) {
  try {
    const promises = studentIds.map(async (studentId) => {
      await updateStudent({ id: studentId, courseId });
    });
    await Promise.all(promises);

    return true;
  } catch (err) {
    throw err;
  }
}