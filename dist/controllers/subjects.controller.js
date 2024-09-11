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
const SubjectsController = {
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { name, course_id, teacherId, schelude, startSubject, endSubject, students } = req.body;
            if (!name || !course_id) {
                return res
                    .status(400)
                    .json({
                    result: false,
                    message: 'Fields name and course_id are required',
                });
            }
            else {
                const subject = yield prisma.subject.findFirst({
                    where: {
                        name,
                        //     courseId,
                    }
                });
                if (subject) {
                    return res.status(403).json({
                        result: false,
                        message: 'Subject already exists',
                    });
                }
            }
            const subjectData = {
                name,
                course_id: parseInt(course_id),
                schelude: schelude ? schelude : [],
                startSubjet: startSubject ? startSubject : null,
                endSubject: endSubject ? endSubject : null,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            subjectData['teacherId'] = teacherId ? parseInt(teacherId) : null;
            if (students) {
                subjectData['students'] = {
                    connect: students.map((studentId) => ({
                        id: parseInt(studentId),
                    }))
                };
            }
            const subject = yield prisma.subject.create({
                data: subjectData,
            });
            return res.status(201).json({
                result: true,
                subject: subject,
            });
        }
        catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }),
    update: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = parseInt(req.params.subject_id);
            if (!id) {
                return res.status(400).json({
                    result: false,
                    message: 'Id is required',
                });
            }
            const { name, teacherId, course_id, schelude, startSubject, endSubject, active, students } = req.body;
            // Preparar los datos para la actualización
            const data = {
                updatedAt: new Date(),
            };
            if (name !== undefined)
                data.name = name;
            if (teacherId !== undefined)
                data.teacherId = teacherId;
            if (course_id !== undefined)
                data.course_id = course_id;
            if (schelude !== undefined)
                data.schelude = schelude;
            if (startSubject !== undefined)
                data.startSubject = startSubject;
            if (endSubject !== undefined)
                data.endSubject = endSubject;
            if (active !== undefined)
                data.active = active;
            if (students !== undefined)
                data.students = { set: students.map((studentId) => ({ id: studentId })) };
            // Actualizar el subject
            const subject = yield prisma.subject.update({
                where: {
                    id: id,
                },
                data,
            });
            return res.status(200).json({
                result: true,
                message: 'Subject updated',
                subject,
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                result: false,
                message: 'Internal server error',
            });
        }
    }),
    addStudents: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const subjectId = parseInt(req.params.subject_id);
        const { students } = req.body;
        if (!subjectId || !students) {
            return res.status(400).json({
                result: false,
                message: 'Fields subjectId and students are required',
            });
        }
        try {
            students.forEach((studentId) => __awaiter(void 0, void 0, void 0, function* () {
                yield prisma.subject.update({
                    where: {
                        id: subjectId
                    },
                    data: {
                        students: {
                            connect: {
                                id: studentId
                            }
                        }
                    }
                });
            }));
            return res.status(200).json({
                result: true,
                message: 'Students added successfully',
            });
        }
        catch (error) {
            res.status(500).json({
                result: false,
                message: 'Internal server error',
            });
        }
    }),
    delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = parseInt(req.params.subject_id);
            const subject = yield prisma.subject.update({
                where: {
                    id: id,
                    active: true,
                },
                data: {
                    active: false,
                    updatedAt: new Date(),
                },
            });
            if (subject) {
                return res.status(202).json({
                    result: true,
                    message: 'Subject deleted',
                    subject,
                });
            }
        }
        catch (error) {
            res.status(500).json({
                result: false,
                message: 'Internal server error',
                error: error,
            });
        }
    }),
    getAll: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const course_id = parseInt(req.query.course_id);
        try {
            if (course_id) {
                const subjects = yield prisma.subject.findMany({
                    where: {
                        active: true,
                        // courseId,
                    },
                });
                if (!subjects || subjects.length === 0) {
                    return res.status(404).json({
                        result: false,
                        message: 'Subjects not found',
                    });
                }
                else {
                    return res.status(200).json({
                        result: true,
                        message: 'Subjects found',
                        subjects,
                    });
                }
            }
            else {
                const subjects = yield prisma.subject.findMany({
                    where: {
                        active: true,
                    },
                });
                if (subjects && subjects.length > 0) {
                    return res.status(200).json({
                        result: true,
                        message: 'Subjects found',
                        subjects,
                    });
                }
                return res.status(404).json({
                    result: false,
                    message: 'Subjects not found',
                });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                result: false,
                message: 'Internal server error',
                error: error,
            });
        }
    }),
};
export default SubjectsController;
