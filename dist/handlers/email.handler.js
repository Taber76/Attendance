var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import sgMail from '@sendgrid/mail';
import { SENDGRID_API_KEY } from "../config/environment.js";
import emailTemplates from '../templates/email.templates.js';
sgMail.setApiKey(SENDGRID_API_KEY);
export class EmailHandler {
    constructor() { }
    static sendEmail(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield sgMail.send(msg);
                if (response[0].statusCode !== 202)
                    return { success: false, message: 'Email not sent' };
                return { success: true, message: 'Email sent.' };
            }
            catch (error) {
                return error;
            }
        });
    }
    static sendVerificationEmail(email, fullname, verificationCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const msg = yield emailTemplates.confirmEmail(email, fullname, verificationCode);
                return yield this.sendEmail(msg);
            }
            catch (error) {
                return {
                    success: false,
                    message: 'Error sending verification email.',
                    error
                };
            }
        });
    }
    static sendForgotPasswordEmail(email, code) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const msg = yield emailTemplates.forgotPassword(email, code);
                return yield this.sendEmail(msg);
            }
            catch (error) {
                return {
                    success: false,
                    message: 'Error sending forgot password email.',
                    error
                };
            }
        });
    }
}
