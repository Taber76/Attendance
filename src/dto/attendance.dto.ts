
export default class AttendanceDTO {
  private constructor() { }


  public static register(data: any) {
    const { student_id, subject_id, course_id } = data;
    if (!student_id || (!subject_id && !course_id))
      return {
        error: {
          message: 'All fields are required: student_id, subject_id or course_id'
        }
      }

    return {
      error: null,
      value: {
        student_id,
        subject_id,
        course_id,
        date: new Date(),
      }
    }
  }


}