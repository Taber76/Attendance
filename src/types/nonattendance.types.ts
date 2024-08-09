export enum NonAttendanceType {
  UNJUSTIFIED = 'UNJUSTIFIED',
  JUSTIFIED = 'JUSTIFIED',
  LATE = 'LATE',
  DELETED = 'DELETED'
}

export interface NonAttendanceAttributes {
  id: number;
  date: Date;
  student_id: number;
  subject_id: number;
  course_id: number;
  type: NonAttendanceType;
}

export interface NonAttendanceCreationAttributes
  extends Omit<NonAttendanceAttributes, 'id'> {
}

export interface NonAttendanceUpdateAttributes
  extends Partial<Omit<NonAttendanceAttributes, 'date' | 'student_id' | 'subject_id' | 'course_id'>> {
}