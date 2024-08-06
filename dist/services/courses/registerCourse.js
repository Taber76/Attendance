var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import PostgreDAO from "../../dao/postgre.dao.js";
export function registerCourse(course) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const postgreDAOInstance = yield PostgreDAO.getInstance();
            const existingCourse = yield postgreDAOInstance.getFromTable("courses", {
                level: course.level,
                number: course.number,
                letter: course.letter
            });
            if (existingCourse.length > 0)
                return {
                    message: `Course with level: ${course.level}, number: ${course.number} and letter: ${course.letter} already exists`
                };
            const registeredCourse = yield postgreDAOInstance.insertIntoTable("courses", course);
            if (!registeredCourse)
                throw new Error("Unable to register course");
            return {
                message: "Course created",
                result: true,
                course: registeredCourse[0]
            };
        }
        catch (err) {
            throw err;
        }
    });
}
