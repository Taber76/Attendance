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
const prisma_client_js_1 = require("../config/prisma.client.js");
const student_helper_js_1 = __importDefault(require("../helpers/student.helper.js"));
const StudentsController = {
    getStudents: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (req.query.id) {
                const id = parseInt(req.query.id);
                const student = yield prisma_client_js_1.prisma.student.findUnique({
                    where: {
                        id: id,
                        active: true
                    }
                });
                if (student) {
                    return res.status(200).json({
                        result: true,
                        message: 'Student found',
                        student
                    });
                }
                return res.status(404).json({
                    result: false,
                    message: 'Student not found'
                });
            }
            const students = yield prisma_client_js_1.prisma.student.findMany({
                where: {
                    active: true
                }
            });
            if (students && students.length > 0) {
                return res.status(200).json({
                    result: true,
                    message: 'Students found',
                    students
                });
            }
            return res.status(404).json({
                result: false,
                message: 'Students not found'
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                result: false,
                message: 'Internal server error'
            });
        }
    }),
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const checkData = yield student_helper_js_1.default.checkData(req.body);
            if (!checkData.result) {
                return res.status(400).json({
                    result: false,
                    message: checkData.message
                });
            }
            const { internal_id, name, surname, password, personal_id, birthdate, contact_email, contact_phone, subject_id } = req.body;
            const student = yield prisma_client_js_1.prisma.student.create({
                data: {
                    name,
                    surname,
                    personal_id: personal_id ? personal_id : null,
                    birthdate: birthdate ? new Date(birthdate) : null,
                    internal_id: internal_id ? internal_id : null,
                    contact_phone: contact_phone ? contact_phone : null,
                    contact_email: contact_email ? contact_email : null,
                }
            });
            if (subject_id && student) {
                yield prisma_client_js_1.prisma.student.update({
                    where: { id: student.id },
                    data: {
                        subjects: { connect: subject_id }
                    }
                });
            }
            if (student) {
                return res.status(201).json({
                    result: true,
                    message: 'Student created',
                    student
                });
            }
            return res.status(400).json({
                result: false,
                message: 'Student not created'
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                result: false,
                message: 'Internal server error'
            });
        }
    }),
    excelImport: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!req.file || !req.body.name || !req.body.surname) {
                return res.status(400).json({
                    result: false,
                    message: 'File and column name and surname are required'
                });
            }
            const studentsStatus = [];
            const students = yield student_helper_js_1.default.registerFromExcel(req.file, Object.assign({}, req.body));
            const promises = students.map((student) => __awaiter(void 0, void 0, void 0, function* () {
                const checkData = yield student_helper_js_1.default.checkData(student);
                if (!checkData.result) {
                    studentsStatus.push(Object.assign(Object.assign({}, student), { status: checkData.message }));
                }
                else {
                    studentsStatus.push(Object.assign(Object.assign({}, student), { status: 'created' }));
                    yield prisma_client_js_1.prisma.student.create({ data: student });
                }
                return yield prisma_client_js_1.prisma.student.create({ data: student });
            }));
            yield Promise.all(promises);
            return res.status(201).json({
                result: true,
                message: 'Students created',
                studentsStatus
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                result: false,
                message: 'Internal server error'
            });
        }
    }),
    update: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = parseInt(req.params.student_id);
            if (!id) {
                return res.status(400).json({
                    result: false,
                    message: 'Id is required',
                });
            }
            const { internal_id, name, surname, password, personal_id, birthdate, contact_email, contact_phone } = req.body;
            const data = {
                internal_id: internal_id || null,
                name: name || null,
                surname: surname || null,
                password: password || null,
                personal_id: personal_id || null,
                birthdate: new Date(birthdate) || null,
                contact_email: contact_email || null,
                contact_phone: contact_phone || null
            };
            const student = yield prisma_client_js_1.prisma.student.update({
                where: { id: id },
                data
            });
            if (student) {
                return res.status(200).json({
                    result: true,
                    message: 'Student updated',
                    student
                });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                result: false,
                message: 'Internal server error'
            });
        }
    }),
    delete: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = parseInt(req.params.student_id);
            if (!id) {
                return res.status(400).json({
                    result: false,
                    message: 'Id is required',
                });
            }
            const student = yield prisma_client_js_1.prisma.student.update({
                where: {
                    id: id,
                    active: true
                },
                data: {
                    active: false,
                    updatedAt: new Date()
                }
            });
            if (student) {
                return res.status(200).json({
                    result: true,
                    message: 'Student deleted',
                    student
                });
            }
            return res.status(404).json({
                result: false,
                message: 'Student not found'
            });
        }
        catch (error) {
            let message = 'Internal server error';
            if (error.code === 'P2025') {
                message = 'Student not found';
            }
            res.status(500).json({
                result: false,
                message: message
            });
        }
    }),
    getDeleted: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const students = yield prisma_client_js_1.prisma.student.findMany({
                where: {
                    active: false
                }
            });
            if (students) {
                return res.status(200).json({
                    result: true,
                    message: 'Students found',
                    students
                });
            }
            return res.status(404).json({
                result: false,
                message: 'Students not found'
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                result: false,
                message: 'Internal server error'
            });
        }
    }),
    restore: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const id = parseInt(req.params.student_id);
            if (!id) {
                return res.status(400).json({
                    result: false,
                    message: 'Id is required',
                });
            }
            const student = yield prisma_client_js_1.prisma.student.update({
                where: {
                    id: id,
                    active: false
                },
                data: {
                    active: true,
                    updatedAt: new Date()
                }
            });
            if (student) {
                return res.status(200).json({
                    result: true,
                    message: 'Student restored'
                });
            }
            return res.status(404).json({
                result: false,
                message: 'Student not found'
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                result: false,
                message: 'Internal server error'
            });
        }
    })
};
exports.default = StudentsController;
