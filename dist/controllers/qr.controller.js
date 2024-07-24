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
const qr_handler_js_1 = __importDefault(require("../handlers/qr.handler.js"));
const stream_1 = require("stream");
const QRController = {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { data, pageSizeMm, qrSizeMm, marginMm } = req.body;
                if (!data || !pageSizeMm || !qrSizeMm || !marginMm) {
                    return res.status(400).json({
                        msg: 'No data or size provided',
                        response: false
                    });
                }
                const generatedPDF = yield qr_handler_js_1.default.create(data, pageSizeMm, qrSizeMm, marginMm);
                if (generatedPDF) {
                    const pdfBuffer = new stream_1.Readable({
                        read() {
                            this.push(Buffer.from(generatedPDF));
                            this.push(null);
                        }
                    });
                    res.setHeader('Content-Type', 'application/pdf; charset=utf-8');
                    res.setHeader('Content-Disposition', 'inline; filename=generated.pdf');
                    pdfBuffer.pipe(res);
                }
                else {
                    return res.status(500).json({
                        msg: 'PDF generation failed',
                        response: false
                    });
                }
            }
            catch (error) {
                return res.status(500).json({
                    msg: 'Internal server error',
                    response: false
                });
            }
        });
    }
};
exports.default = QRController;
