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
  createdAt: Date;
  updatedAt: Date;
}

export interface UserCreationAttributes
  extends Omit<UserAttributes, 'id' | 'role' | 'createdAt' | 'updatedAt'> {
}

export interface UserUpdateAttributes
  extends Partial<Omit<UserAttributes, 'createdAt' | 'updatedAt'>> {
}

export interface UserCredentialsAttributes {
  email: string;
  password: string;
}