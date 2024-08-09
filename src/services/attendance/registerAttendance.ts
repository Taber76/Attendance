import PostgreDAO from "../../dao/postgre.dao.js";
import { AttendanceCreationAttributes } from "../../types/index.js";


export async function registerAttendance(attendance: AttendanceCreationAttributes) {
  try {
    const postgreDAOInstance = await PostgreDAO.getInstance();

    const registeredAttendance = await postgreDAOInstance.insertIntoTable<AttendanceCreationAttributes>(
      "attendances",
      attendance
    );
    if (!registeredAttendance) throw new Error("Unable to register attendance");

    return {
      message: "Attendance registered",
      result: true,
      course: registeredAttendance[0]
    }
  } catch (err) {
    throw err;
  }
}