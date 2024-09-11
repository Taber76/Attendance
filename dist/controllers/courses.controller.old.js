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
const CoursesController = {
    getAll: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const courses = yield prisma_client_js_1.prisma.course.findMany({
                where: {
                    active: true
                }
            });
            if (courses && courses.length > 0) {
                return res.status(200).json({
                    result: true,
                    message: 'Courses found',
                    courses
                });
            }
            return res.status(404).json({
                result: false,
                message: 'Courses not found'
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
    create: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { level, number, letter } = req.body;
            if (!level || !number || !letter) {
                return res.status(400).json({ message: "Fields level, number and letter is required" });
            }
            let course = yield prisma_client_js_1.prisma.course.findFirst({
                where: {
                    level,
                    number,
                    letter
                },
            });
            if (course) {
                return res.status(400).json({
                    result: false,
                    message: "Course already exists",
                });
            }
            course = yield prisma_client_js_1.prisma.course.create({
                data: {
                    level,
                    number,
                    letter,
                    updatedAt: new Date(),
                },
            });
            if (course) {
                return res.status(201).json({
                    result: true,
                    message: "Course created",
                    course,
                });
            }
            return res.status(400).json({
                result: false,
                message: "Course not created",
            });
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                result: false,
                message: "Internal server error",
            });
        }
    }),
    update: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = parseInt(req.params.course_id);
        if (!id) {
            return res.status(400).json({
                result: false,
                message: 'Id is required',
            });
        }
        const { level, number, letter } = req.body;
        if (!level || !number || !letter) {
            return res.status(400).json({
                result: false,
                message: 'All fields are required',
            });
        }
        try {
            const course = yield prisma_client_js_1.prisma.course.update({
                where: {
                    id: id,
                    active: true,
                },
                data: {
                    level,
                    number,
                    letter,
                    updatedAt: new Date()
                },
            });
            if (course) {
                return res.status(200).json({
                    result: true,
                    message: 'Course updated successfully',
                    course,
                });
            }
        }
        catch (error) {
            let message = 'Internal server error';
            if (error.code === 'P2025') {
                message = 'Course not found';
            }
            res.status(500).json({
                result: false,
                message: message
            });
        }
    }),
    addSubjects: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        const id = parseInt(req.params.course_id);
        if (!id) {
            return res.status(400).json({
                result: false,
                message: 'Id is required',
            });
        }
        const { subjects } = req.body;
        if (!subjects) {
            return res.status(400).json({
                result: false,
                message: 'Must send subjects',
            });
        }
        try {
            subjects.forEach((subjectId) => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield prisma_client_js_1.prisma.subject.update({
                        where: {
                            id: subjectId
                        },
                        data: {
                            course_id: id
                        }
                    });
                }
                catch (error) {
                    if (error.code === 'P2025' || error.code === 'P2003') {
                        console.log(`Subject with id ${subjectId} or course with id ${id} not found`);
                    }
                    else {
                        throw error;
                    }
                }
            }));
            return res.status(200).json({
                result: true,
                message: 'Subjects added successfully',
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
            const id = parseInt(req.params.course_id);
            if (!id) {
                return res.status(400).json({
                    result: false,
                    message: 'Id is required',
                });
            }
            const course = yield prisma_client_js_1.prisma.course.update({
                where: {
                    id,
                    active: true,
                },
                data: {
                    active: false,
                    updatedAt: new Date()
                }
            });
            if (course) {
                return res.status(200).json({
                    result: true,
                    message: "Course deleted",
                    course,
                });
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).json({
                result: false,
                message: "Internal server error",
            });
        }
    }),
    getDeleted: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const courses = yield prisma_client_js_1.prisma.course.findMany({
                where: {
                    active: false
                }
            });
            if (courses && courses.length > 0) {
                return res.status(200).json({
                    result: true,
                    message: 'Courses found',
                    courses
                });
            }
            return res.status(404).json({
                result: false,
                message: 'Courses not found'
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
            const id = parseInt(req.params.course_id);
            if (!id) {
                return res.status(400).json({
                    result: false,
                    message: 'Id is required',
                });
            }
            const course = yield prisma_client_js_1.prisma.course.update({
                where: {
                    id: id,
                    active: false
                },
                data: {
                    active: true,
                    updatedAt: new Date()
                }
            });
            if (course) {
                return res.status(200).json({
                    result: true,
                    message: 'Course restored'
                });
            }
            return res.status(404).json({
                result: false,
                message: 'Course not found'
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
exports.default = CoursesController;
