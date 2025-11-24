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

/**
 * @swagger
 * tags:
 * - name: Recipes
 * description: Recipe management and retrieval endpoints
 */

/**
 * @swagger
 * /api/recipes:
 * get:
 * summary: Retrieve all recipes
 * tags: [Recipes]
 * responses:
 * 200:
 * description: A list of recipes
 * post:
 * summary: Create a new recipe
 * tags: [Recipes]
 * security:
 * - bearerAuth: []
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - title
 * - cuisine
 * - mealType
 * - difficulty
 * - time
 * properties:
 * title:
 * type: string
 * cuisine:
 * type: string
 * mealType:
 * type: string
 * enum: [Breakfast, Lunch, Dinner, Snack, Dessert]
 * difficulty:
 * type: string
 * enum: [Easy, Medium, Hard]
 * time:
 * type: number
 * responses:
 * 201:
 * description: Recipe created successfully
 * 401:
 * description: Unauthorized
 */
router.get('/', getRecipes);
router.post('/', protect, createRecipe);

/**
 * @swagger
 * /api/recipes/search:
 * get:
 * summary: Search and filter recipes
 * tags: [Recipes]
 * parameters:
 * - in: query
 * name: ingredients
 * schema:
 * type: string
 * description: Comma-separated list of ingredients
 * - in: query
 * name: cuisine
 * schema:
 * type: string
 * - in: query
 * name: mealType
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Filtered list of recipes
 */
router.get('/search', searchRecipes);

/**
 * @swagger
 * /api/recipes/{id}:
 * get:
 * summary: Get recipe details by ID
 * tags: [Recipes]
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * description: The recipe ID
 * responses:
 * 200:
 * description: Recipe details retrieved
 * 404:
 * description: Recipe not found
 * put:
 * summary: Update a recipe
 * tags: [Recipes]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * requestBody:
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * title:
 * type: string
 * ingredients:
 * type: array
 * responses:
 * 200:
 * description: Recipe updated successfully
 * delete:
 * summary: Delete a recipe
 * tags: [Recipes]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * required: true
 * schema:
 * type: string
 * responses:
 * 200:
 * description: Recipe deleted successfully
 */
router.get('/:id', getRecipeById);
router.put('/:id', protect, updateRecipe);
router.delete('/:id', protect, deleteRecipe);

/**
 * @swagger
 * /api/recipes/{id}/comments:
 * post:
 * summary: Add a comment and rating to a recipe
 * tags: [Recipes]
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
 * - text
 * - rating
 * properties:
 * text:
 * type: string
 * description: Comment content
 * rating:
 * type: number
 * minimum: 1
 * maximum: 5
 * responses:
 * 201:
 * description: Comment added successfully
 */
router.post('/:id/comments', protect, addComment);

export default router;