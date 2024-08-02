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
  courseId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentCreationAttributes
  extends Omit<StudentAttributes, 'id' | 'active' | 'courseId' | 'created_at' | 'updated_at'> {
}

export interface StudentUpdateAttributes
  extends Partial<Omit<StudentAttributes, 'created_at' | 'updated_at'>> {
}