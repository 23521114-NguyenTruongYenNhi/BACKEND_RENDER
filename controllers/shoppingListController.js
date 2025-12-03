import ShoppingList from '../models/ShoppingList.js';
import Recipe from '../models/Recipe.js';

// @desc    Get user's shopping list
// @route   GET /api/shopping-list
// @access  Private
export const getShoppingList = async (req, res) => {
  try {
    let shoppingList = await ShoppingList.findOne({ user: req.user._id });
    
    if (!shoppingList) {
      // Create new shopping list if doesn't exist
      shoppingList = await ShoppingList.create({
        user: req.user._id,
        items: []
      });
    }
    
    res.json(shoppingList);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add item to shopping list (manual or from recipe)
// @route   POST /api/shopping-list/items
// @access  Private
export const addItemToShoppingList = async (req, res) => {
  try {
    const { name, quantity, unit, recipeId, recipeName, isMissingIngredient, notes } = req.body;
    
    if (!name || !quantity || !unit) {
      return res.status(400).json({ message: 'Name, quantity, and unit are required' });
    }
    
    let shoppingList = await ShoppingList.findOne({ user: req.user._id });
    
    if (!shoppingList) {
      shoppingList = await ShoppingList.create({
        user: req.user._id,
        items: []
      });
    }
    
    const newItem = shoppingList.addItem({
      name,
      quantity: parseFloat(quantity),
      unit,
      recipeId: recipeId || null,
      recipeName: recipeName || null,
      isMissingIngredient: isMissingIngredient || false,
      notes: notes || ''
    });
    
    await shoppingList.save();
    
    res.status(201).json({
      message: 'Item added to shopping list',
      item: newItem,
      shoppingList
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Add multiple missing ingredients from recipe
// @route   POST /api/shopping-list/items/bulk
// @access  Private
export const addBulkItemsToShoppingList = async (req, res) => {
  try {
    const { recipeId, items } = req.body;
    
    if (!recipeId || !items || !Array.isArray(items)) {
      return res.status(400).json({ message: 'Recipe ID and items array are required' });
    }
    
    // Verify recipe exists
    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    let shoppingList = await ShoppingList.findOne({ user: req.user._id });
    
    if (!shoppingList) {
      shoppingList = await ShoppingList.create({
        user: req.user._id,
        items: []
      });
    }
    
    const addedItems = [];
    
    items.forEach(item => {
      if (item.name && item.quantity && item.unit) {
        const newItem = shoppingList.addItem({
          name: item.name,
          quantity: parseFloat(item.quantity),
          unit: item.unit,
          recipeId: recipe._id,
          recipeName: recipe.title,
          isMissingIngredient: true,
          notes: item.notes || ''
        });
        addedItems.push(newItem);
      }
    });
    
    await shoppingList.save();
    
    res.status(201).json({
      message: `Added ${addedItems.length} items to shopping list`,
      items: addedItems,
      shoppingList
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update shopping list item
// @route   PUT /api/shopping-list/items/:itemId
// @access  Private
export const updateShoppingListItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { name, quantity, unit, checked, notes } = req.body;
    
    const shoppingList = await ShoppingList.findOne({ user: req.user._id });
    
    if (!shoppingList) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }
    
    const item = shoppingList.items.id(itemId);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    if (name !== undefined) item.name = name;
    if (quantity !== undefined) item.quantity = parseFloat(quantity);
    if (unit !== undefined) item.unit = unit;
    if (checked !== undefined) item.checked = checked;
    if (notes !== undefined) item.notes = notes;
    
    await shoppingList.save();
    
    res.json({
      message: 'Item updated',
      item,
      shoppingList
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Toggle item checked status
// @route   PUT /api/shopping-list/items/:itemId/toggle
// @access  Private
export const toggleShoppingListItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const shoppingList = await ShoppingList.findOne({ user: req.user._id });
    
    if (!shoppingList) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }
    
    const item = shoppingList.toggleItemChecked(itemId);
    
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    
    await shoppingList.save();
    
    res.json({
      message: `Item ${item.checked ? 'checked' : 'unchecked'}`,
      item,
      shoppingList
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete shopping list item
// @route   DELETE /api/shopping-list/items/:itemId
// @access  Private
export const deleteShoppingListItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const shoppingList = await ShoppingList.findOne({ user: req.user._id });
    
    if (!shoppingList) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }
    
    shoppingList.removeItem(itemId);
    await shoppingList.save();
    
    res.json({
      message: 'Item removed from shopping list',
      shoppingList
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Clear all checked items
// @route   DELETE /api/shopping-list/checked
// @access  Private
export const clearCheckedItems = async (req, res) => {
  try {
    const shoppingList = await ShoppingList.findOne({ user: req.user._id });
    
    if (!shoppingList) {
      return res.status(404).json({ message: 'Shopping list not found' });
    }
    
    const checkedCount = shoppingList.items.filter(item => item.checked).length;
    
    shoppingList.clearCheckedItems();
    await shoppingList.save();
    
    res.json({
      message: `Cleared ${checkedCount} checked items`,
      shoppingList
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get shopping list items by recipe
// @route   GET /api/shopping-list/recipe/:recipeId
// @access  Private
export const getShoppingListItemsByRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    
    const shoppingList = await ShoppingList.findOne({ user: req.user._id });
    
    if (!shoppingList) {
      return res.json({ items: [] });
    }
    
    const items = shoppingList.getItemsByRecipe(recipeId);
    
    res.json({ items });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
