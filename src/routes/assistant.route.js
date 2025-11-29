import express from 'express';
import AssistantController from '../controllers/assistant.controller.js';

const router = express.Router();

router.post('/generate-response', AssistantController.generateResponse);

export default router;
