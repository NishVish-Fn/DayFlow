import { Router } from 'express';
import { handleAIChat } from '../controllers/ai.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

// Route: POST /api/ai/chat
router.post('/chat', authenticate, handleAIChat);

export default router;
