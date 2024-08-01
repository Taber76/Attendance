"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cronRouter = void 0;
const express_1 = __importDefault(require("express"));
const cron_controller_js_1 = __importDefault(require("../controllers/cron.controller.js"));
exports.cronRouter = express_1.default
    .Router() // Path: /api/cron
    // -- Routes --
    .get('/updateAttendance', cron_controller_js_1.default.updateAttendance);
