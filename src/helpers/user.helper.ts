import { prisma } from "../config/prisma.client.js";


const userHelper = {

  isValidEmail: (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  },

  isValidPassword: (password: string) => {
    return password.length >= 8
  },

  getLoginAttempts: async (email: string) => {
    try {
      const attempts = await prisma.loginattempts.findUnique({
        where: {
          email
        }
      })
      if (!attempts) {
        await prisma.loginattempts.create({
          data: {
            email
          }
        })
        return 2
      } else if (attempts.createdAt < new Date(Date.now() - 1800000)) { // 30 minutes passed
        await prisma.loginattempts.update({
          where: {
            email
          }, data: {
            attempts: 1,
            createdAt: new Date()
          }
        })
        return 2
      } else if (attempts.attempts < 3) {
        await prisma.loginattempts.update({
          where: {
            email
          }, data: {
            attempts: attempts.attempts + 1
          }
        })
        return 2 - attempts.attempts
      } else {
        return -1
      }

    } catch (error: any) {
      throw new error(error);
    }
  },

  deleteLoginAttempts: async (email: string) => {
    try {
      await prisma.loginattempts.update({
        where: {
          email
        }, data: {
          attempts: 0
        }
      })
    } catch (error: any) {
      throw new error(error);
    }
  },


  getEmailSendCode: async (email: string) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    await prisma.activation.create({
      data: {
        email,
        code
      }
    })
    return code
  },

  checkEmailCode: async (code: string) => {
    const emailCodes = await prisma.activation.findUnique({ where: { code } })
    if (!emailCodes) return { success: false, message: 'Invalid code.' }
    if (emailCodes.createdAt < new Date(Date.now() - 60 * 60 * 1000)) {
      await prisma.activation.delete({ where: { code } })
      return { success: false, message: 'Code expired.' }
    }
    await prisma.activation.deleteMany({ where: { email: emailCodes.email } })
    return { success: true, message: 'Email verified.', email: emailCodes.email }
  }
}

export default userHelper


export class UserHelper {
  private constructor() { }

  public static createCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

}