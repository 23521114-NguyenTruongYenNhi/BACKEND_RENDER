import express from 'express';
import {
    getRecipes,
    searchRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    addComment,
} from '../controllers/recipeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getRecipes);
router.get('/search', searchRecipes);
router.get('/:id', getRecipeById);
router.post('/', protect, createRecipe);
router.put('/:id', protect, updateRecipe);
router.delete('/:id', protect, deleteRecipe);
router.post('/:id/comments', protect, addComment);

export default router;