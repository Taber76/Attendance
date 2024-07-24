export interface SubjectAttributes {
  id: number;
  name: string;
  teacherId: number;
  courseId: number;
  schedule: JSON[];
  startSubject: Date;
  endSubject: Date;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface SubjectCreationAttributes
  extends Omit<SubjectAttributes, 'id' | 'active' | 'created_at' | 'updated_at'> {
}

export interface SubjectUpdateAttributes
  extends Omit<SubjectAttributes, 'created_at' | 'updated_at'> {
}