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
