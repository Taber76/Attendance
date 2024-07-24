"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_js_1 = require("../config/prisma.client.js");
const userHelper = {
    isValidEmail: (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    },
    isValidPassword: (password) => {
        return password.length >= 8;
    },
    getLoginAttempts: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const attempts = yield prisma_client_js_1.prisma.loginattempts.findUnique({
                where: {
                    email
                }
            });
            if (!attempts) {
                yield prisma_client_js_1.prisma.loginattempts.create({
                    data: {
                        email
                    }
                });
                return 2;
            }
            else if (attempts.createdAt < new Date(Date.now() - 1800000)) { // 30 minutes passed
                yield prisma_client_js_1.prisma.loginattempts.update({
                    where: {
                        email
                    }, data: {
                        attempts: 1,
                        createdAt: new Date()
                    }
                });
                return 2;
            }
            else if (attempts.attempts < 3) {
                yield prisma_client_js_1.prisma.loginattempts.update({
                    where: {
                        email
                    }, data: {
                        attempts: attempts.attempts + 1
                    }
                });
                return 2 - attempts.attempts;
            }
            else {
                return -1;
            }
        }
        catch (error) {
            throw new error(error);
        }
    }),
    deleteLoginAttempts: (email) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            yield prisma_client_js_1.prisma.loginattempts.update({
                where: {
                    email
                }, data: {
                    attempts: 0
                }
            });
        }
        catch (error) {
            throw new error(error);
        }
    }),
    getEmailSendCode: (email) => __awaiter(void 0, void 0, void 0, function* () {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        yield prisma_client_js_1.prisma.activation.create({
            data: {
                email,
                code
            }
        });
        return code;
    }),
    checkEmailCode: (code) => __awaiter(void 0, void 0, void 0, function* () {
        const emailCodes = yield prisma_client_js_1.prisma.activation.findUnique({ where: { code } });
        if (!emailCodes)
            return { success: false, message: 'Invalid code.' };
        if (emailCodes.createdAt < new Date(Date.now() - 60 * 60 * 1000)) {
            yield prisma_client_js_1.prisma.activation.delete({ where: { code } });
            return { success: false, message: 'Code expired.' };
        }
        yield prisma_client_js_1.prisma.activation.deleteMany({ where: { email: emailCodes.email } });
        return { success: true, message: 'Email verified.', email: emailCodes.email };
    })
};
exports.default = userHelper;
