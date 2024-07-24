export interface CourseAttributes {
  id: number;
  level: string;
  number: number;
  letter: string;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CourseCreationAttributes
  extends Omit<CourseAttributes, 'id' | 'active' | 'created_at' | 'updated_at'> {
}

export interface CourseUpdateAttributes
  extends Omit<CourseAttributes, 'created_at' | 'updated_at'> {
}