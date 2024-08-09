import PostgreDAO from "../../dao/postgre.dao.js";
import { NonAttendanceUpdateAttributes } from "../../types/index.js";

export async function updateNotAttendedById(nonAttendanceData: NonAttendanceUpdateAttributes) {
  try {
    const postgreDAOInstance = await PostgreDAO.getInstance();
    const nonAttendanceUpdated = await postgreDAOInstance.updateTable<NonAttendanceUpdateAttributes>(
      'nonattendances',
      nonAttendanceData,
      { id: nonAttendanceData.id }
    )
    if (nonAttendanceUpdated > 0) {
      return true;
    }
    throw new Error('Non attendance not updated');
  } catch (err) {
    throw err;
  }
}