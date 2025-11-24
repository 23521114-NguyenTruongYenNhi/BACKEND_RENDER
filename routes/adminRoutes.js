import express from 'express';
import {
  getRecipes,
  approveRecipe,
  rejectRecipe,
  deleteRecipe,
  getUsers,
  lockUser,
  unlockUser,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply Authentication and Admin Middleware to all routes
router.use(protect);
router.use(admin);

/**
 * @swagger
 * tags:
 * name: Admin
 * description: Administrative operations (Requires Admin privileges)
 */

/**
 * @swagger
 * /api/admin/recipes:
 * get:
 * summary: Get all recipes (including pending/rejected)
 * tags: [Admin]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: query
 * name: status
 * schema:
 * type: string
 * enum: [pending, approved, rejected]
 * description: Filter recipes by approval status
 * responses:
 * 200:
 * description: List of recipes
 * 403:
 * description: Access denied (Admin only)
 */
router.get('/recipes', getRecipes);

/**
 * @swagger
 * /api/admin/recipes/{id}/approve:
 * post:
 * summary: Approve a submitted recipe
 * tags: [Admin]
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
 * description: Recipe approved successfully
 */
router.post('/recipes/:id/approve', approveRecipe);

/**
 * @swagger
 * /api/admin/recipes/{id}/reject:
 * post:
 * summary: Reject a submitted recipe
 * tags: [Admin]
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
 * description: Recipe rejected
 */
router.post('/recipes/:id/reject', rejectRecipe);

/**
 * @swagger
 * /api/admin/recipes/{id}:
 * delete:
 * summary: Force delete a recipe
 * tags: [Admin]
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
router.delete('/recipes/:id', deleteRecipe);

/**
 * @swagger
 * /api/admin/users:
 * get:
 * summary: Retrieve all registered users
 * tags: [Admin]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: List of users with statistics
 */
router.get('/users', getUsers);

/**
 * @swagger
 * /api/admin/users/{id}/lock:
 * post:
 * summary: Lock a user account
 * tags: [Admin]
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
 * description: User account locked
 */
router.post('/users/:id/lock', lockUser);

/**
 * @swagger
 * /api/admin/users/{id}/unlock:
 * post:
 * summary: Unlock a user account
 * tags: [Admin]
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
 * description: User account unlocked
 */
router.post('/users/:id/unlock', unlockUser);

export default router;