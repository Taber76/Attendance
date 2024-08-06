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
exports.updateManyStudents = void 0;
const updateStudent_1 = require("./updateStudent");
function updateManyStudents(studentIds, courseId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const promises = studentIds.map((studentId) => __awaiter(this, void 0, void 0, function* () {
                yield (0, updateStudent_1.updateStudent)({ id: studentId, courseId });
            }));
            yield Promise.all(promises);
            return true;
        }
        catch (err) {
            throw err;
        }
    });
}
exports.updateManyStudents = updateManyStudents;
