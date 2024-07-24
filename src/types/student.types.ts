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
  created_at: Date;
  updated_at: Date;
}

export interface StudentCreationAttributes
  extends Omit<StudentAttributes, 'id' | 'active' | 'created_at' | 'updated_at'> {
}

export interface StudentUpdateAttributes
  extends Omit<StudentAttributes, 'active' | 'created_at' | 'updated_at'> {
}