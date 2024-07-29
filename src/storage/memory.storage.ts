import { LoginAttempts, VerificationCode } from "../types/memorystorage.types";

export default class MemoryStorage {
  private static loginAttempts: LoginAttempts[] = [];
  private static verificationCodes: VerificationCode[] = [];

  private constructor() { }


  public static addLoginAttempt(email: string) {
    const index = MemoryStorage.loginAttempts.findIndex((attempt) => attempt.email === email);
    if (index !== -1) {
      if (MemoryStorage.loginAttempts[index].created_at < new Date(Date.now() - 30 * 60 * 1000)) {
        MemoryStorage.loginAttempts[index].attempts = 1;
        return 2 // rest login attempts;
      }
      MemoryStorage.loginAttempts[index].attempts += 1;
      return 3 - MemoryStorage.loginAttempts[index].attempts
    } else {
      MemoryStorage.loginAttempts.push({ email, attempts: 1, created_at: new Date() });
      return 2
    }
  }

  public static deleteLoginAttempts(email: string) {
    const index = MemoryStorage.loginAttempts.findIndex((attempt) => attempt.email === email);
    if (index !== -1) {
      MemoryStorage.loginAttempts.splice(index, 1);
    }
  }

  public static getVerificationCode(email: string): string {
    const index = MemoryStorage.verificationCodes.findIndex((code) => code.email === email);
    if (index !== -1) {
      if (MemoryStorage.verificationCodes[index].created_at < new Date(Date.now() - 300 * 60 * 1000)) {
        MemoryStorage.verificationCodes.splice(index, 1);
        return '';
      }
      return MemoryStorage.verificationCodes[index].code;
    } else {
      return '';
    }
  }

  public static getEmailWithCode(code: string): string | null {
    const index = MemoryStorage.verificationCodes.findIndex((c) => c.code === code);
    if (index !== -1) {
      if (MemoryStorage.verificationCodes[index].created_at < new Date(Date.now() - 300 * 60 * 1000)) {
        MemoryStorage.verificationCodes.splice(index, 1);
        return null;
      }
      return MemoryStorage.verificationCodes[index].email;
    } else {
      return null;
    }
  }

  public static addVerificationCode(email: string, code: string) {
    const index = MemoryStorage.verificationCodes.findIndex((code) => code.email === email);
    if (index !== -1) {
      MemoryStorage.verificationCodes[index].created_at = new Date();
      MemoryStorage.verificationCodes[index].code = code;
    } else {
      MemoryStorage.verificationCodes.push({ email, code, created_at: new Date() });
    }
  }

  public static deleteVerificationCode(email: string) {
    const index = MemoryStorage.verificationCodes.findIndex((code) => code.email === email);
    if (index !== -1) {
      MemoryStorage.verificationCodes.splice(index, 1);
    }
  }


}