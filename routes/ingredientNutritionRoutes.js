import express from 'express';
import {
  getAllIngredientNutrition,
  getIngredientNutritionByName,
  calculateIngredientNutrition,
  calculateRecipeNutrition,
  createIngredientNutrition
} from '../controllers/ingredientNutritionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllIngredientNutrition);
router.get('/:name', getIngredientNutritionByName);
router.post('/calculate', calculateIngredientNutrition);
router.post('/calculate-recipe', calculateRecipeNutrition);

// Admin routes
router.post('/create', protect, admin, createIngredientNutrition);

export default router;
