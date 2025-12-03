import express from 'express';
import {
  getShoppingList,
  addItemToShoppingList,
  addBulkItemsToShoppingList,
  updateShoppingListItem,
  toggleShoppingListItem,
  deleteShoppingListItem,
  clearCheckedItems,
  getShoppingListItemsByRecipe
} from '../controllers/shoppingListController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All shopping list routes require authentication
router.use(protect);

router.get('/', getShoppingList);
router.post('/items', addItemToShoppingList);
router.post('/items/bulk', addBulkItemsToShoppingList);
router.put('/items/:itemId', updateShoppingListItem);
router.put('/items/:itemId/toggle', toggleShoppingListItem);
router.delete('/items/:itemId', deleteShoppingListItem);
router.delete('/checked', clearCheckedItems);
router.get('/recipe/:recipeId', getShoppingListItemsByRecipe);

export default router;
