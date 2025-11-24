import express from 'express';
import {
    getUserProfile,
    getUserFavorites,
    toggleFavorite,
    getUserRecipes,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:id', getUserProfile);
router.get('/:id/favorites', getUserFavorites);
router.post('/:id/favorites', protect, toggleFavorite);
router.get('/:id/recipes', getUserRecipes);

export default router;