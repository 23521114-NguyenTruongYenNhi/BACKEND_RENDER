import express from 'express';
import {
    getUserProfile,
    getUserFavorites,
    toggleFavorite,
    getUserRecipes,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: Users
 * description: User profile and favorites management
 */

/**
 * @swagger
 * /api/users/{id}:
 * get:
 * summary: Get public user profile
 * tags: [Users]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: User profile data
 * 404:
 * description: User not found
 */
router.get('/:id', getUserProfile);

/**
 * @swagger
 * /api/users/{id}/favorites:
 * get:
 * summary: Get user's favorite recipes
 * tags: [Users]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: List of favorite recipes
 * post:
 * summary: Add or remove a recipe from favorites
 * tags: [Users]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - recipeId
 * properties:
 * recipeId:
 * type: string
 * responses:
 * 200:
 * description: Favorite status toggled
 */
router.get('/:id/favorites', getUserFavorites);
router.post('/:id/favorites', protect, toggleFavorite);

/**
 * @swagger
 * /api/users/{id}/recipes:
 * get:
 * summary: Get recipes created by a specific user
 * tags: [Users]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: List of created recipes
 */
router.get('/:id/recipes', getUserRecipes);

export default router;