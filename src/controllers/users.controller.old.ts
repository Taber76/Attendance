import { Request, Response } from 'express-serve-static-core';
import { prisma } from '../config/prisma.client.js';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendEmail from '../handlers/email.handler.js';
import emailTemplates from '../templates/email.templates.js';
import userHelper from '../helpers/user.helper.js';

import {
  JWT_SECRET,
  BCRYPT_ROUNDS as bcrypt_rounds,
  backend_url
} from '../config/environment.js';
const passwordSalt = bcrypt.genSaltSync(bcrypt_rounds);

enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
  TEACHER = 'TEACHER',
}

const UsersController = {

  login: async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        result: false,
        message: 'Email and password are required'
      });
    }
    try {
      const remainingAttempts = await userHelper.getLoginAttempts(email);
      if (remainingAttempts === -1) {
        return res.status(401).json({
          result: false,
          message: 'Too many attempts. Please try again later.'
        });
      }
      const user = await prisma.user.findUnique({
        where: {
          email,
          active: true
        },
      });
      if (!user) {
        return res.status(404).json({
          result: false,
          message: 'User not found or not activated.',
        });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({
          result: false,
          message: 'Incorrect password.',
          remainingAttempts
        });
      }
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "36000s" });
      userHelper.deleteLoginAttempts(email);
      return res.status(200).json({
        token,
        result: true,
        user: { ...user, password: null },
      });
    } catch (error: any) {
      return res.status(500).json({
        result: false,
        message: 'Internal server error.'
      })
    }
  },

  register: async (req: Request, res: Response) => {
    try {
      const { email, fullname, username, password } = req.body;
      if (!email || !fullname || !username || !password) {
        return res.status(400).json({
          message: 'All fields are required.',
          result: false
        });
      }
      let user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: email },
            { username: username }
          ]
        },
      })
        ;
      if (user) {
        return res.status(401).json({
          result: false,
          message: 'Email or username already exists.',
        });
      }

      if (!userHelper.isValidEmail(email) || !userHelper.isValidPassword(password)) {
        return res.status(400).json({
          result: false,
          message: 'Invalid email or password less than 8 characters.',
        });
      }

      const hashPassword = await bcrypt.hash(password, passwordSalt);
      const data = {
        email,
        fullname,
        username,
        password: hashPassword,
        active: false
      }
      if (req.user) data.active = true

      user = await prisma.user.create({ data });

      const code = await userHelper.getEmailSendCode(email);
      if (user) {
        const template = await emailTemplates.confirmEmail(email, fullname, code);
        const emailResponse = await sendEmail(template);
        if (emailResponse.result) {
          return res.status(201).json({
            result: true,
            message:
              'User created successfully. User will check email to get the confirmation code to activate the account.',
            user: { ...user, password: null },
          });
        }
        return res.status(400).json({
          result: false,
          message: 'Confirmation email not sent.',
        })
      }
      return res.status(400).json({
        result: false,
        message: 'User not created.',
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        result: false,
        message: 'Internal server error',
      });
    }
  },

  // Confirmacion de cuenta: recibe code que fue enviado por email
  confirm: async (req: Request, res: Response) => {
    try {
      const { code } = req.params as { code: string };
      if (!code) {
        return res.status(400).json({
          result: false,
          message: 'Code is required.',
        });
      }
      const checkEmailCode = await userHelper.checkEmailCode(code);
      if (!checkEmailCode.success) {
        return res.status(400).json({
          result: false,
          message: checkEmailCode.message
        });
      }
      const user = await prisma.user.update({
        where: {
          email: checkEmailCode.email
        },
        data: {
          active: true
        }
      })
      return res.status(200).json({
        result: true,
        message: 'Email confirmed successfully.',
        user: { ...user, password: null }
      });
    } catch (error: any) {
      console.log(error);
      res.status(500).json({
        result: false,
        message: 'Internal server error',
      });
    }
  },

  // Recuperacion de contraseña: envia email para recuperar la contraseña
  forgotPassword: async (req: Request, res: Response) => {
    try {
      const email = req.body.email
      if (!email) {
        return res.status(400).json({
          result: false,
          message: 'Email is required.'
        });
      }
      const user = await prisma.user.findUnique({ where: { email } })
      if (user === null) {
        return res.status(404).json({
          result: false,
          message: 'User not found.'
        });
      }
      const code = await userHelper.getEmailSendCode(email);
      const template = await emailTemplates.forgotPassword(email, code);
      const emailResponse = await sendEmail(template);
      if (!emailResponse.result) {
        return res.status(400).json({
          result: false,
          message: 'Email not sent',
        })
      }
      return res.status(200).json({
        result: true,
        message: 'Email sent',
      })
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        result: false,
        message: 'Internal server error'
      });
    }
  },

  // Recupera la contraseña: recibe code y nueva contraseña.
  resetPassword: async (req: Request, res: Response) => {
    try {
      const { email, code, password } = req.body;
      if (!email || !code || !password) {
        return res.status(400).json({
          result: false,
          message: 'Email, code and password are required!'
        });
      }
      const checkEmailCode = await userHelper.checkEmailCode(code);
      if (!checkEmailCode.success) {
        return res.status(400).json({
          result: false,
          message: checkEmailCode.message
        });
      }
      if (checkEmailCode.email !== email) {
        return res.status(400).json({
          result: false,
          message: 'Invalid email.'
        });
      }
      const hashPassword = await bcrypt.hash(password, passwordSalt);
      const user = await prisma.user.update({
        where: {
          email: checkEmailCode.email
        },
        data: {
          password: hashPassword
        }
      })
      return res.status(200).json({
        result: true,
        message: 'Password updated successfully',
        user: { ...user, password: null }
      })
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({
        result: false,
        message: 'Internal server error'

      });
    }
  },

  getUsers: async (req: Request, res: Response) => {
    try {
      const users = await prisma.user.findMany({
        where: {
          //active: true
        },
        select: {
          id: true,
          fullname: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
          active: true
        }
      })
      if (users) {
        return res.status(200).json({
          result: true,
          message: 'Users found',
          users
        })
      }
      return res.status(404).json({
        result: false,
        message: 'Users not found'
      })
    } catch (error: any) {
      console.log(error)
      res.status(500).json({
        result: false,
        message: 'Internal server error'
      })
    }
  },

  getById: async (req: Request, res: Response) => {
    const id = parseInt(req.params.user_id as string);
    if (!id) {
      return res.status(400).json({
        result: false,
        message: 'Id is required',
      });
    }
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: id
        },
        select: {
          id: true,
          fullname: true,
          username: true,
          email: true,
          role: true,
          createdAt: true,
          active: true
        }
      });
      if (user) {
        return res.status(200).json({
          result: true,
          message: 'User found.',
          user
        });
      }
      return res.status(404).json({
        result: false,
        message: 'User not found.',
      });
    } catch (error: any) {
      console.log(error)
      res.status(500).json({
        result: false,
        message: 'Internal server error'
      })
    }
  },

  delete: async (req: Request, res: Response) => {
    const id = parseInt(req.params.user_id as string);
    if (!id) {
      return res.status(400).json({
        result: false,
        message: 'Id is required',
      });
    }
    try {
      const user = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          active: false,
          updatedAt: new Date()
        },
      });
      if (user) {
        return res.status(200).json({
          result: true,
          message: 'User deleted successfully',
          user,
        });
      }
    } catch (error: any) {
      console.log(error)
      let message = 'Internal server error'
      if (error.code === 'P2025') {
        message = 'User not found'
      }
      res.status(500).json({
        result: false,
        message: message
      })
    }
  },

  assignRole: async (req: Request, res: Response) => {
    const id = parseInt(req.params.user_id as string);
    const { role } = req.body;
    if (!id) {
      return res.status(400).json({
        result: false,
        message: 'Id is required',
      });
    }
    if (!role) {
      return res.status(400).json({
        result: false,
        message: 'Role field is required',
      });
    }
    if (!(role in Roles)) {
      return res.status(400).json({
        result: false,
        message: `${role} is not an assignable role`,
      });
    }
    try {
      const user = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          role: role,
          updatedAt: new Date()
        },
      });
      if (user) {
        return res.status(200).json({
          result: true,
          message: 'Role successfully assigned',
          user,
        });
      }
    } catch (error: any) {
      let message = 'Internal server error'
      if (error.code === 'P2025') {
        message = 'User not found'
      }
      res.status(500).json({
        result: false,
        message: message
      })
    }
  },

  update: async (req: any, res: Response) => {
    const id = parseInt(req.user.id as string);
    const { user_id, fullname, username, email, password } = req.body;
    if (!user_id) {
      return res.status(400).json({
        result: false,
        message: 'User id is required.',
      });
    }
    if (!fullname && !username && !email && !password) {
      return res.status(400).json({
        result: false,
        message: 'At least one field must be updated.',
      });
    }
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      if (!user) {
        return res.status(400).json({
          result: false,
          message: 'User not found',
        });
      }

      let updatedUser: any = {};
      const updatedData: any = {};
      if (fullname) updatedData.fullname = fullname;
      if (username) updatedData.username = username;
      if (email) updatedData.email = email;
      if (password) updatedData.password = await bcrypt.hash(password, passwordSalt);;

      if (user.role !== 'ADMIN' && user_id !== id) {
        return res.status(400).json({
          result: false,
          message: 'You are not authorized to update this user.',
        });
      }
      updatedUser = await prisma.user.update({ where: { id: user_id }, data: updatedData });

      if (email) {
        const code = await userHelper.getEmailSendCode(email);
        const template = await emailTemplates.confirmEmail(email, fullname, code);
        const emailResponse = await sendEmail(template);

        if (!emailResponse.result) {
          return res.status(500).json({
            result: false,
            message: 'Verification email could not be sent.',
          })
        }
      }

      return res.status(202).json({
        result: true,
        message: 'User updated successfully',
        updated: { ...updatedUser, password: undefined },
      })
    } catch (error: any) {
      res.status(500).json({
        result: false,
        message: 'Internal server error'
      })
    }
  },

  updateByAdmin: async (req: any, res: Response) => {
    const user_id = parseInt(req.params.user_id as string);
    const { fullname, username, email, password, role, active } = req.body;
    if (!user_id) {
      return res.status(400).json({
        result: false,
        message: 'User id is required.',
      });
    }
    if (!fullname && !username && !email && !role && !active && !password) {
      return res.status(400).json({
        result: false,
        message: 'At least one field is required',
      });
    }
    try {
      const updated: any = {};
      if (fullname) updated.fullname = fullname
      if (username) updated.username = username;
      if (role) {
        if (!(role in Roles))
          return res.status(400).json({
            result: false,
            message: `${role} is not an assignable role, please choose one of the following: ${Object.values(Roles).join(', ')}`
          });
        else updated.role = role
      }
      if (email) updated.email = email;
      if (password) updated.password = await bcrypt.hash(password, passwordSalt);
      if (active) updated.active = active;
      const updatedUser = await prisma.user.update({
        where: {
          id: user_id,
        },
        data: {
          ...updated,
          updatedAt: new Date()
        },
      });

      // falta enviar notificacion por email al usuario

      return res.status(202).json({
        result: true,
        message: 'User updated successfully',
        updated: { ...updatedUser, password: null }
      })
    } catch (error: any) {
      res.status(500).json({
        result: false,
        message: 'Internal server error'
      })
    }
  },

  updateEmail: async (req: Request, res: Response) => {
    const { token, email } = req.params;
    if (!token) {
      return res.status(400).json({
        result: false,
        message: 'Token is required',
      });
    }
    if (!email) {
      return res.status(400).json({
        result: false,
        message: 'Email is required',
      });
    }
    try {
      const decodedToken = jwt.verify(token, JWT_SECRET) as { email: string } | null;
      const userUpdated = await prisma.user.update({
        where: {
          email: decodedToken?.email || 'email', // <---------------------------------- ARREGLAR
        },
        data: {
          email: email,
          updatedAt: new Date()
        },
      })
      if (userUpdated) {
        return res.status(202).json({
          result: true,
          message: 'Email updated successfully',
        })
      }
      res.status(500).json({
        result: false,
        message: 'Internal server error'
      })

    } catch (error: any) {
      res.status(500).json({
        result: false,
        message: 'Internal server error'
      })
    }
  },


};

export default UsersController;
