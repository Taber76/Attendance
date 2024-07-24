export interface LoginAttempts {
  email: string
  attempts: number
  created_at: Date
}

export interface VerificationCode {
  email: string
  code: string
  created_at: Date
}