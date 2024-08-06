import * as bcrypt from 'bcrypt';

import { BCRYPT_ROUNDS } from '../config/environment.js';
import { UserRole } from '../types/index.js';

export default class UserDTO {
  private static salt = bcrypt.genSaltSync(BCRYPT_ROUNDS);
  private constructor() { }

  private static checkEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static checkPassword(password: string) {
    //const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    //return passwordRegex.test(password);
    return password.length >= 8
  }


  public static register(data: any, user: any) {
    const { fullname, username, email, password } = data;
    if (!fullname || !username || !email || !password)
      return {
        error: {
          message: 'All fields are required: fullname, username, email and password'
        }
      }

    if (!this.checkEmail(email))
      return {
        error: {
          message: 'Invalid email'
        }
      }

    if (!this.checkPassword(password))
      return {
        error: {
          message: 'Invalid password, password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character'
        }
      }

    const hashPassword = bcrypt.hashSync(password, this.salt);

    return {
      error: null, value: {
        fullname,
        username,
        email,
        password: hashPassword,
        active: user ? true : false
      }
    }
  }

  public static login(data: any) {
    const { email, password } = data;
    if (!email || !password)
      return {
        error: {
          message: 'All fields are required: email and password'
        }
      }
    if (!this.checkEmail(email))
      return {
        error: {
          message: 'Invalid email'
        }
      }

    return {
      error: null,
      value: {
        email,
        password
      }
    }
  }

  public static forgotPassword(data: any) {
    const { email } = data;
    if (!email)
      return {
        error: {
          message: 'All fields are required: email'
        }
      }
    if (!this.checkEmail(email))
      return {
        error: {
          message: 'Invalid email'
        }
      }
    return {
      error: null,
      value: {
        email
      }
    }
  }

  public static resetPassword(data: any) {
    const { email, password, code } = data;
    if (!email || !password || !code)
      return {
        error: {
          message: 'All fields are required: email, password and code'
        }
      }
    if (!this.checkEmail(email))
      return {
        error: {
          message: 'Invalid email'
        }
      }

    if (!this.checkPassword(password))
      return {
        error: {
          message: 'Invalid password, password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character'
        }
      }

    const hashPassword = bcrypt.hashSync(password, this.salt);

    return {
      error: null,
      value: {
        email,
        password: hashPassword,
        code
      }
    }
  }

  public static updateUser(data: any, user: any) {
    const { fullname, username, email, password, role, active } = data;
    if (!fullname && !username && !email && !password && !role && !active || !user.id)
      return {
        error: {
          message: 'A least one field is required: fullname, username, email and password'
        }
      }

    if (email && !this.checkEmail(email))
      return {
        error: {
          message: 'Invalid email'
        }
      }

    if (password && !this.checkPassword(password))
      return {
        error: {
          message: 'Invalid password, password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character'
        }
      }

    if (role && !(role in UserRole))
      return {
        error: {
          message: `${role} is not an assignable role`
        }
      }

    const response: any = {
      id: parseInt(user.id as string),
      updatedAt: new Date()
    };
    if (fullname) response.fullname = fullname;
    if (username) response.username = username;
    if (email) response.email = email;
    if (password) response.password = bcrypt.hashSync(password, this.salt);
    if (role) response.role = role;
    if (active) response.active = active;

    return {
      error: null,
      value: response,
    };

  }

}