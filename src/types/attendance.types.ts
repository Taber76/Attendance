export interface AttendanceAttributes {
  id: number;
  date: Date;
  student_id: number;
  subject_id: number;
  course_id: number;
  registered: boolean;
}

export interface AttendanceCreationAttributes
  extends Omit<AttendanceAttributes, 'id' | 'registered'> {
}

export interface AttendanceUpdateAttributes
  extends Omit<AttendanceAttributes, 'date' | 'student_id' | 'subject_id' | 'course_id'> {
}