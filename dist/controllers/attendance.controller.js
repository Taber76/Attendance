var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { prisma } from '../config/prisma.client.js';
const AttendanceController = {
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const studentId = parseInt(req.params.studentId);
            const subjectId = 67; //parseInt(req.params.subjectId as string)
            if (!studentId || !subjectId) {
                return res.status(400).json({
                    result: false,
                    message: 'Valid studentId and subjectId is required',
                });
            }
            const student = yield prisma.student.findUnique({
                where: {
                    id: studentId,
                    active: true
                },
                select: {
                    name: true,
                    surname: true
                }
            });
            if (!student) {
                return res.status(404).json({
                    result: false,
                    message: 'Student not found',
                });
            }
            yield prisma.attendance.create({
                data: {
                    date: new Date(),
                    subjectId,
                    studentId,
                }
            });
            return res.status(201).json({
                result: true,
                student: student.name,
            });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }),
    getNotAttendedByStudent: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const studentId = parseInt(req.params.studentId);
            const nonattendances = yield prisma.nonattendance.findMany({
                where: {
                    studentId
                },
                orderBy: {
                    date: 'asc'
                }
            });
            return res.status(200).json({
                result: true,
                nonattendances
            });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }),
    updateNotAttendedById: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = parseInt(req.params.nonAttendanceId);
            const type = req.params.type;
            const notAttended = yield prisma.nonattendance.update({
                where: {
                    id
                },
                data: {
                    type
                }
            });
            return res.status(200).json({
                result: true,
                notAttended
            });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }),
};
export default AttendanceController;
