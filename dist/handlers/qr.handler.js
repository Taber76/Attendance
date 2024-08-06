var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { PDFDocument, rgb } from 'pdf-lib';
import * as QRCode from 'qrcode';
const QrHandler = {
    create(data, pageSizeMm, qrSizeMm, marginMm) {
        return __awaiter(this, void 0, void 0, function* () {
            const mm2dot = 2.8352; // 1 mm = 2.8352 dots
            const pageSize = { width: pageSizeMm.width * mm2dot, height: pageSizeMm.height * mm2dot };
            const qrSize = { width: qrSizeMm.width * mm2dot, height: qrSizeMm.height * mm2dot };
            const margin = marginMm * mm2dot;
            const horizontalStudents = Math.floor(pageSize.width / (qrSize.width + margin));
            const verticalStudents = Math.floor(pageSize.height / (qrSize.height + margin));
            const studentsPerPage = horizontalStudents * verticalStudents;
            const totalPages = Math.ceil(data.length / studentsPerPage);
            const pdfDoc = yield PDFDocument.create();
            for (let pageIdx = 0; pageIdx < totalPages; pageIdx++) {
                const page = pdfDoc.addPage([pageSize.width, pageSize.height]);
                for (let i = pageIdx * studentsPerPage; i < Math.min((pageIdx + 1) * studentsPerPage, data.length); i++) {
                    let qrCodeImage = yield QRCode.toDataURL(JSON.stringify(data[i]));
                    let qrBuffer = Buffer.from(qrCodeImage.split(',')[1], 'base64');
                    let qrImage = yield pdfDoc.embedPng(qrBuffer);
                    const col = i % horizontalStudents;
                    const row = Math.floor((i - (pageIdx * studentsPerPage)) / horizontalStudents);
                    page.drawImage(qrImage, {
                        x: (qrSize.width * col + margin * (1 + col)),
                        y: (margin + row * (qrSize.height + margin)),
                        width: qrSize.width,
                        height: qrSize.height,
                    });
                    page.drawRectangle({
                        x: (qrSize.width * col + margin * (1 + col)),
                        y: (margin + row * (qrSize.height + margin)),
                        width: qrSize.width,
                        height: qrSize.height,
                        borderColor: rgb(0, 0, 0),
                        borderWidth: 1
                    });
                    page.drawText(data[i].name + ' ' + data[i].surname, {
                        x: (qrSize.width * col + margin * (1 + col)),
                        y: (margin + row * (qrSize.height + margin) + qrSize.height + 3),
                        size: 12
                    });
                }
            }
            try {
                const pdfBytes = yield pdfDoc.save();
                return pdfBytes;
            }
            catch (error) {
                console.error(error);
                return null;
            }
        });
    }
};
export default QrHandler;
