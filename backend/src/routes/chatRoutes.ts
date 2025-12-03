import { Router } from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  getOrCreateChat,
  getChatById,
  getMyChats,
  getMessages,
  sendMessage
} from '../controllers/chatController';

const router = Router();

// Tất cả routes chat đều cần auth
router.use(authMiddleware);

// Lưu ý thứ tự routes rất quan trọng để tránh CastError với "me"

// Lấy hoặc tạo chat với người bán về một property
router.get('/property/:propertyId', getOrCreateChat);

// Lấy danh sách chat của user
// Đặt trước route '/:chatId' để '/me' không bị coi là chatId
router.get('/me', getMyChats);

// Lấy thông tin một chat theo ID
router.get('/:chatId', getChatById);

// Lấy messages của một chat
router.get('/:chatId/messages', getMessages);

// Gửi message
router.post('/:chatId/messages', sendMessage);

export default router;

