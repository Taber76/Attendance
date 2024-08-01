export interface CourseAttributes {
  id: number;
  level: string;
  number: number;
  letter: string;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CourseCreationAttributes
  extends Omit<CourseAttributes, 'id' | 'active' | 'createdAt' | 'updatedAt'> {
}

export interface CourseUpdateAttributes
  extends Omit<CourseAttributes, 'createdAt' | 'updatedAt'> {
}