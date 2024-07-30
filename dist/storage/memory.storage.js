"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MemoryStorage {
    constructor() { }
    static addLoginAttempt(email) {
        const index = MemoryStorage.loginAttempts.findIndex((attempt) => attempt.email === email);
        if (index !== -1) {
            if (MemoryStorage.loginAttempts[index].created_at < new Date(Date.now() - 30 * 60 * 1000)) {
                MemoryStorage.loginAttempts[index].attempts = 1;
                return 2; // rest login attempts;
            }
            MemoryStorage.loginAttempts[index].attempts += 1;
            return 3 - MemoryStorage.loginAttempts[index].attempts;
        }
        else {
            MemoryStorage.loginAttempts.push({ email, attempts: 1, created_at: new Date() });
            return 2;
        }
    }
    static deleteLoginAttempts(email) {
        const index = MemoryStorage.loginAttempts.findIndex((attempt) => attempt.email === email);
        if (index !== -1) {
            MemoryStorage.loginAttempts.splice(index, 1);
        }
    }
    static getCodeWithEmail(email) {
        const index = MemoryStorage.verificationCodes.findIndex((code) => code.email === email);
        if (index !== -1) {
            if (MemoryStorage.verificationCodes[index].created_at < new Date(Date.now() - 300 * 60 * 1000)) {
                MemoryStorage.verificationCodes.splice(index, 1);
                return '';
            }
            return MemoryStorage.verificationCodes[index].code;
        }
        else {
            return '';
        }
    }
    static getEmailWithCode(code) {
        const index = MemoryStorage.verificationCodes.findIndex((c) => c.code === code);
        if (index !== -1) {
            if (MemoryStorage.verificationCodes[index].created_at < new Date(Date.now() - 300 * 60 * 1000)) {
                MemoryStorage.verificationCodes.splice(index, 1);
                return null;
            }
            return MemoryStorage.verificationCodes[index].email;
        }
        else {
            return null;
        }
    }
    static addVerificationCode(email, code) {
        const index = MemoryStorage.verificationCodes.findIndex((code) => code.email === email);
        if (index !== -1) {
            MemoryStorage.verificationCodes[index].created_at = new Date();
            MemoryStorage.verificationCodes[index].code = code;
        }
        else {
            MemoryStorage.verificationCodes.push({ email, code, created_at: new Date() });
        }
    }
    static deleteVerificationCode(email) {
        const index = MemoryStorage.verificationCodes.findIndex((code) => code.email === email);
        if (index !== -1) {
            MemoryStorage.verificationCodes.splice(index, 1);
        }
    }
}
MemoryStorage.loginAttempts = [];
MemoryStorage.verificationCodes = [];
exports.default = MemoryStorage;
