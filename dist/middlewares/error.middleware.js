"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const httpStatusCodes_1 = __importDefault(require("../constants/httpStatusCodes"));
function errorHandler(error, req, res, next) {
    var _a, _b, _c, _d, _e, _f;
    console.log(error.stack);
    if (error.name === "SequelizeValidationError" || error.name === "SequelizeDatabaseError") {
        return res.status(httpStatusCodes_1.default.BAD_REQUEST).json({
            success: false,
            message: error.message,
            error: (_c = (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((e) => e.message).join(", ")) !== null && _b !== void 0 ? _b : error.name) !== null && _c !== void 0 ? _c : error
        });
    }
    res.status(httpStatusCodes_1.default.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Internal server error.",
        error: (_f = (_e = (_d = error.errors) === null || _d === void 0 ? void 0 : _d.map((e) => e.message).join(", ")) !== null && _e !== void 0 ? _e : error.name) !== null && _f !== void 0 ? _f : "InternalServerError"
    });
}
exports.errorHandler = errorHandler;
