import express from 'express';
import QRController from '../controllers/qr.controller.js';
export const qrRouter = express
    .Router() // Path: /api/qr
    // -- Routes --
    .post('/create', QRController.create);
