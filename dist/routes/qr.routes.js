"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.qrRouter = void 0;
const express_1 = __importDefault(require("express"));
const qr_controller_js_1 = __importDefault(require("../controllers/qr.controller.js"));
exports.qrRouter = express_1.default
    .Router() // Path: /api/qr
    // -- Routes --
    .post('/create', qr_controller_js_1.default.create);
