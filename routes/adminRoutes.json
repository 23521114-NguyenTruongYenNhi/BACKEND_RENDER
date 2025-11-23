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

// All routes require authentication and admin role
router.use(protect);
router.use(admin);

// Recipe management routes
router.get('/recipes', getRecipes);
router.post('/recipes/:id/approve', approveRecipe);
router.post('/recipes/:id/reject', rejectRecipe);
router.delete('/recipes/:id', deleteRecipe);

// User management routes
router.get('/users', getUsers);
router.post('/users/:id/lock', lockUser);
router.post('/users/:id/unlock', unlockUser);

export default router;
