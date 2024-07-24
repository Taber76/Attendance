export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  TEACHER = 'TEACHER',
}

export interface UserAttributes {
  id: number;
  fullname: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
  active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface UserCreationAttributes
  extends Omit<UserAttributes, 'id' | 'role' | 'created_at' | 'updated_at'> {
}

export interface UserUpdateAttributes
  extends Omit<UserAttributes, 'created_at' | 'updated_at'> {
}