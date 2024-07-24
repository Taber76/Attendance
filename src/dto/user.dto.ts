import * as bcrypt from 'bcrypt';

export default class UserDTO {
  private constructor() { }

  private static checkEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private static checkPassword(password: string) {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
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

    const hashPassword = bcrypt.hashSync(password, 10);

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


}