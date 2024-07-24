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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailHandler = void 0;
const mail_1 = __importDefault(require("@sendgrid/mail"));
const environment_js_1 = require("../config/environment.js");
const email_templates_js_1 = __importDefault(require("../templates/email.templates.js"));
mail_1.default.setApiKey(environment_js_1.SENDGRID_API_KEY);
function sendEmail(email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const msg = {
                to: email.to,
                from: 'sync.ideas.group@gmail.com',
                subject: email.subject,
                text: email.text,
                html: email.html,
            };
            yield mail_1.default.send(msg);
            return { result: true };
        }
        catch (error) {
            console.error(error);
            return { result: false, error };
        }
    });
}
exports.default = sendEmail;
class EmailHandler {
    constructor() { }
    static sendEmail(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield mail_1.default.send(msg);
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
                const msg = email_templates_js_1.default.confirmEmail(email, fullname, verificationCode);
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
}
exports.EmailHandler = EmailHandler;
