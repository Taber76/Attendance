import express from 'express';

import QRController from '../controllers/qr.controller.js';

// Path: /api/qr
// -- Not protected routes --
export const notProtectedRoutes = express
  .Router()
  .post('/create', QRController.create)
