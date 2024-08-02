"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCodes_1 = __importDefault(require("../constants/httpStatusCodes"));
class ControllerHandler {
    constructor() { }
    static ok(message, res, data, token) {
        const response = { result: true, message };
        if (data)
            response.data = data;
        if (token)
            response.token = token;
        return res.status(httpStatusCodes_1.default.OK).json(response);
    }
    static created(message, data, res) {
        return res.status(httpStatusCodes_1.default.CREATED).json({
            result: true,
            message,
            data
        });
    }
    static badRequest(message, res) {
        return res.status(httpStatusCodes_1.default.BAD_REQUEST).json({
            result: false,
            message
        });
    }
    static notFound(message, res) {
        return res.status(httpStatusCodes_1.default.NOT_FOUND).json({
            result: false,
            message
        });
    }
}
exports.default = ControllerHandler;
