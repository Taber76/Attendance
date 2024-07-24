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
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_js_1 = require("../config/prisma.client.js");
const CronController = {
    updateAttendance: (_, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Cron running');
        res.status(200).json({
            result: true,
            message: 'Cron running',
        });
        fetch('https://cron-jobs-6rn2.onrender.com');
    }),
    updateAttendanceOLD: (_, res) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('Cron running');
        res.status(200).json({
            result: true,
            message: 'Cron running',
        });
        // Obtener estudiantes inactivos
        const inactiveStudents = yield prisma_client_js_1.prisma.student.findMany({ select: { id: true }, where: { active: false } });
        // Registrar asistencias de estudiantes inactivos
        const idsToUpdate = inactiveStudents.map(student => student.id);
        yield prisma_client_js_1.prisma.attendance.updateMany({
            where: {
                "studentId": {
                    in: idsToUpdate
                },
                registered: false
            },
            data: {
                registered: true
            }
        });
        // Obtener todos los id de estudiantes
        const students = yield prisma_client_js_1.prisma.student.findMany({ select: { id: true }, where: { active: true } });
        // Obtener todas las fechas con registro de asistencias no registradas
        const dates = yield prisma_client_js_1.prisma.$queryRaw `
      SELECT
        DATE(date) AS day
      FROM attendances
      WHERE registered = false
      GROUP BY day
    `;
        // Verificar asistencias de las fechas con registro para todos los estudiantes
        for (const date of dates) {
            for (const student of students) { // Estudiantes activos
                const attendance = yield prisma_client_js_1.prisma.$queryRaw `
          SELECT
            *
          FROM attendances
          WHERE
            DATE(date) = ${date.day} AND
            "studentId" = ${student.id} AND
            registered = false
        `;
                if (attendance.length < 1) { // No hay asistencia registrada
                    yield prisma_client_js_1.prisma.nonattendance.create({
                        data: {
                            date: new Date(date.day),
                            subjectId: 67,
                            studentId: student.id
                        }
                    });
                }
                if (attendance.length > 0) {
                    // Borrar registros de asistencia duplicados
                    const idsToDelete = attendance.slice(1).map(attendance => attendance.id);
                    yield prisma_client_js_1.prisma.attendance.deleteMany({
                        where: {
                            id: {
                                in: idsToDelete
                            }
                        }
                    });
                    // actualizar asistencia registrada
                    yield prisma_client_js_1.prisma.attendance.updateMany({
                        where: {
                            id: attendance[0].id
                        },
                        data: {
                            registered: true
                        }
                    });
                }
            }
        }
    })
};
exports.default = CronController;
