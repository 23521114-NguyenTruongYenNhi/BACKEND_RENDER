import express from 'express';
// Sửa 'signup' thành 'register' để khớp với file controller
import { register, login } from '../controllers/authController.js';

const router = express.Router();

// Đường dẫn vẫn là /signup, nhưng gọi hàm xử lý là register
router.post('/signup', register);
router.post('/login', login);

export default router;