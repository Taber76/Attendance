import { StudentCreationAttributes } from "../../types/index.js";
import { registerStudent } from "./registerStudent.js";
import studentHelper from '../../helpers/student.helper.js';

export async function registerStudentsWithExcel(excelFile: any, dictionary: any) {
  try {
    const studentsStatus: any[] = [];
    const students = await studentHelper.registerFromExcel(excelFile, { ...dictionary });

    const promises = students.map(async (student: StudentCreationAttributes) => {

      const registredStudent = await registerStudent(student);
      if (!registredStudent.result) {
        studentsStatus.push({ ...student, status: registredStudent.message })
      } else {
        studentsStatus.push({ ...student, status: registredStudent.message })
      }
    })
    await Promise.all(promises)

    return studentsStatus
  } catch (err) {
    throw err;
  }
}