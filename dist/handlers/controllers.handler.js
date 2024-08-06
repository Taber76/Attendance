import HTTP_STATUS from "../constants/httpStatusCodes.js";
export default class ControllerHandler {
    constructor() { }
    static ok(message, res, data, token) {
        const response = { result: true, message };
        if (data)
            response.data = data;
        if (token)
            response.token = token;
        return res.status(HTTP_STATUS.OK).json(response);
    }
    static created(message, data, res) {
        return res.status(HTTP_STATUS.CREATED).json({
            result: true,
            message,
            data
        });
    }
    static badRequest(message, res) {
        return res.status(HTTP_STATUS.BAD_REQUEST).json({
            result: false,
            message
        });
    }
    static notFound(message, res) {
        return res.status(HTTP_STATUS.NOT_FOUND).json({
            result: false,
            message
        });
    }
}
