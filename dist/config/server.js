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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const helmet_1 = __importDefault(require("helmet"));
const hpp_1 = __importDefault(require("hpp"));
const environment_1 = require("./environment");
const error_middleware_1 = require("../middlewares/error.middleware");
const postgre_pool_1 = __importDefault(require("./postgre.pool"));
const routes_1 = require("../routes");
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.database();
        this.middlewares();
        this.routes();
        this.errorHandler();
        this.listen();
    }
    database() {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield postgre_pool_1.default.getInstance();
            /*  if (SYNC_DB === 1) {
                try {
                  await db.sync();
                  console.log('Database synchronized successfully.');
                } catch (err) {
                  console.error('Unable to sync the database:', err);
                }
              }
             */
        });
    }
    middlewares() {
        this.app.use((0, helmet_1.default)());
        this.app.use((0, hpp_1.default)());
        this.app.use((0, express_rate_limit_1.default)({ windowMs: 15 * 60 * 1000, max: 100, standardHeaders: true, legacyHeaders: false }));
        this.app.use((0, cors_1.default)({ origin: environment_1.CORS_ORIGIN }));
        this.app.use(express_1.default.json());
    }
    routes() {
        this.app.use(`/${environment_1.API_VERSION}/users`, routes_1.usersRouter);
        this.app.use(`/${environment_1.API_VERSION}/students`, routes_1.studentsRouter);
        this.app.use(`/${environment_1.API_VERSION}/subjects`, routes_1.subjectsRouter);
        this.app.use(`/${environment_1.API_VERSION}/courses`, routes_1.coursesRouter);
        this.app.use(`/${environment_1.API_VERSION}/attendance`, routes_1.attendanceRouter);
        this.app.use(`/${environment_1.API_VERSION}/qr`, routes_1.qrRouter);
        this.app.use(`/${environment_1.API_VERSION}/cron`, routes_1.cronRouter);
    }
    errorHandler() {
        this.app.use(error_middleware_1.errorHandler);
    }
    listen() {
        this.server = this.app.listen(environment_1.PORT, () => {
            console.log(`Server running on port ${environment_1.PORT}`);
        });
    }
    close() {
        this.server.close();
    }
}
exports.default = Server;
