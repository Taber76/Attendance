import HTTP_STATUS from "../constants/httpStatusCodes.js";
export function errorHandler(error, req, res, next) {
    var _a, _b, _c;
    console.log(error.stack);
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: error.message || "Internal server error.",
        error: (_c = (_b = (_a = error.errors) === null || _a === void 0 ? void 0 : _a.map((e) => e.message).join(", ")) !== null && _b !== void 0 ? _b : error.name) !== null && _c !== void 0 ? _c : "InternalServerError"
    });
}
