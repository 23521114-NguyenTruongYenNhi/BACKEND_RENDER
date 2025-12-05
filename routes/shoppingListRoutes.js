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

// Apply authentication middleware to all routes
router.use(protect);

// Retrieve the current user's shopping list
router.get('/', getShoppingList);

// Add a single item to the list
router.post('/items', addItemToShoppingList);

// Add multiple items at once
router.post('/items/bulk', addBulkItemsToShoppingList);

// Update item details (quantity, name, etc.)
router.put('/items/:itemId', updateShoppingListItem);

// Toggle item completion status (Fixed: Changed from PUT to PATCH)
router.patch('/items/:itemId/toggle', toggleShoppingListItem);

// Remove a specific item
router.delete('/items/:itemId', deleteShoppingListItem);

// Clear all completed items (Fixed: Changed path to match client)
router.delete('/clear-completed', clearCheckedItems);

// Get items associated with a specific recipe
router.get('/recipe/:recipeId', getShoppingListItemsByRecipe);

// Note: If you implement the 'Add from Recipe' feature, you may need to add:
// router.post('/add-from-recipe', addItemsFromRecipeController);

export default router;