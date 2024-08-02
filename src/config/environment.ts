import dotenv from 'dotenv'
dotenv.config()

export const PORT = process.env.PORT
export const API_VERSION = process.env.API_VERSION
export const CORS_ORIGIN = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN : '*'

export const DBASE_URL = process.env.DBASE_URL ? process.env.DBASE_URL : 'postgresql://postgres:postgres@localhost:5432/postgres'

export const JWT_SECRET = process.env.JWT_SECRET ? process.env.JWT_SECRET : ''
export const BCRYPT_ROUNDS = Number(process.env.BCRYPT_ROUNDS)
export const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY ? process.env.SENDGRID_API_KEY : ''

export const fronend_url = process.env.FRONTEND_URL
export const backend_url = process.env.BACKEND_URL
