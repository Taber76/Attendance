import PostgreDAO from "../../dao/postgre.dao.js";

export async function getAttendanceByDate(date: string, course_id: number | null) {
  try {
    const postgreDAOInstance = await PostgreDAO.getInstance();
    const result = await postgreDAOInstance.executeQuery(
      query,
      [date, course_id]
    );

    return result.rows
  } catch (err) {
    throw err;
  }
}

const query = `
  SELECT
    s.id,
    s.name,
    s.surname,
    s.course_id,
    a.date,
    CASE 
      WHEN a.student_id IS NOT NULL THEN true 
      ELSE false 
      END AS attended  
  FROM students s
  LEFT JOIN attendances a ON s.id = a.student_id AND a.date::date = $1
  WHERE ($2::INT IS NULL OR s.course_id = $2)
`