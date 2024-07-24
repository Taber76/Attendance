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
            return 3;
        }
    }
    static getVerificationCode(email) {
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
}
MemoryStorage.loginAttempts = [];
MemoryStorage.verificationCodes = [];
exports.default = MemoryStorage;
