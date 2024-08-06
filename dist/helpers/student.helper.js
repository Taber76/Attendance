var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { prisma } from "../config/prisma.client.js";
import xlsx from 'xlsx';
import userHelper from "../helpers/user.helper.js";
const studentHelper = {
    checkData: (newStudent) => __awaiter(void 0, void 0, void 0, function* () {
        if (!newStudent.name || !newStudent.surname) {
            return { result: false, message: 'Name(name) and surname(surname) are required' };
        }
        // Check if exist a student with the same name and surname
        let student = yield prisma.student.findFirst({
            where: { name: newStudent.name, surname: newStudent.surname }
        });
        if (student) {
            if (student.personal_id && student.personal_id === newStudent.personal_id) {
                return { result: false, message: 'A student with the same name, surname and personal ID already exists. Please use another personal ID.' };
            }
            else if (student.internal_id && student.internal_id === newStudent.internal_id) {
                return { result: false, message: 'A student with the same name, surname and internal ID already exists. Please use another internal ID.' };
            }
            else if (!newStudent.personal_id && !newStudent.internal_id) {
                return { result: false, message: 'Personal ID (personal_id) or internal ID (internal_id) are required, because student already exists with the same name and surname.' };
            }
        }
        // Check if exist a student with the same personal ID
        if (newStudent.personal_id) {
            student = yield prisma.student.findFirst({ where: { name: newStudent.name, surname: newStudent.surname, personal_id: newStudent.personal_id } });
            if (student)
                return { result: false, message: 'A student with the same personal ID already exists. Please use another personal ID.' };
        }
        // Check if exist a student with the same internal ID
        if (newStudent.internal_id) {
            student = yield prisma.student.findFirst({ where: { name: newStudent.name, surname: newStudent.surname, internal_id: newStudent.internal_id } });
            if (student)
                return { result: false, message: 'A student with the same internal ID already exists. Please use another internal ID.' };
        }
        // Check data type
        if (newStudent.contact_email && !userHelper.isValidEmail(newStudent.contact_email))
            return { result: false, message: 'Invalid email format.' };
        if (newStudent.birthdate && isNaN(new Date(newStudent.birthdate).getTime()))
            return { result: false, message: 'Invalid date format on birthdate.' };
        return { result: true };
    }),
    registerFromExcel: (excelFile, dictionary) => __awaiter(void 0, void 0, void 0, function* () {
        const workbook = xlsx.read(excelFile.buffer, { type: 'buffer' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const excelData = xlsx.utils.sheet_to_json(worksheet, { header: 1 });
        const columns = Array.isArray(excelData[0]) ? excelData[0] : [];
        const students = excelData.slice(1).map((row) => {
            const student = {};
            Object.entries(dictionary).forEach(([dbField, excelColumn]) => {
                const columnIndex = columns.indexOf(excelColumn);
                if (columnIndex !== -1) {
                    if (dbField === 'birthdate') {
                        student[dbField] = new Date(row[columnIndex]);
                    }
                    else {
                        student[dbField] = String(row[columnIndex]);
                    }
                }
            });
            return student;
        });
        return students;
    })
};
export default studentHelper;
