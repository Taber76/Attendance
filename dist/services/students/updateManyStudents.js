var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { updateStudent } from "./updateStudent.js";
export function updateManyStudents(studentIds, course_id) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const promises = studentIds.map((studentId) => __awaiter(this, void 0, void 0, function* () {
                yield updateStudent({ id: studentId, course_id });
            }));
            yield Promise.all(promises);
            return true;
        }
        catch (err) {
            throw err;
        }
    });
}
