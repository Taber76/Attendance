export interface StudentAttributes {
  id: number;
  internal_id: string;
  name: string;
  surname: string;
  contact_phone: string;
  contact_email: string;
  birthdate: Date;
  personal_id: string;
  active: boolean;
  course_id: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentCreationAttributes
  extends Omit<StudentAttributes, 'id' | 'active' | 'course_id' | 'created_at' | 'updated_at'> {
}

export interface StudentUpdateAttributes
  extends Partial<Omit<StudentAttributes, 'created_at' | 'updated_at'>> {
}