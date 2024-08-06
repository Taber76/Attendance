var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import QrHandler from '../handlers/qr.handler.js';
import { Readable } from 'stream';
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
                const generatedPDF = yield QrHandler.create(data, pageSizeMm, qrSizeMm, marginMm);
                if (generatedPDF) {
                    const pdfBuffer = new Readable({
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
export default QRController;
