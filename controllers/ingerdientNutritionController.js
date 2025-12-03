import IngredientNutrition from '../models/IngredientNutrition.js';

// @desc    Get all ingredient nutrition data
// @route   GET /api/ingredients/nutrition
// @access  Public
export const getAllIngredientNutrition = async (req, res) => {
  try {
    const ingredients = await IngredientNutrition.find().sort({ name: 1 });
    res.json(ingredients);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get ingredient nutrition by name
// @route   GET /api/ingredients/nutrition/:name
// @access  Public
export const getIngredientNutritionByName = async (req, res) => {
  try {
    const { name } = req.params;
    
    const ingredient = await IngredientNutrition.findOne({
      $or: [
        { name: name.toLowerCase() },
        { aliases: name.toLowerCase() }
      ]
    });
    
    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient nutrition data not found' });
    }
    
    res.json(ingredient);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Calculate nutrition for ingredient with quantity
// @route   POST /api/ingredients/nutrition/calculate
// @access  Public
export const calculateIngredientNutrition = async (req, res) => {
  try {
    const { name, quantity, unit } = req.body;
    
    if (!name || !quantity || !unit) {
      return res.status(400).json({ message: 'Name, quantity, and unit are required' });
    }
    
    const ingredient = await IngredientNutrition.findOne({
      $or: [
        { name: name.toLowerCase() },
        { aliases: name.toLowerCase() }
      ]
    });
    
    if (!ingredient) {
      return res.status(404).json({ message: 'Ingredient nutrition data not found' });
    }
    
    const nutrition = ingredient.calculateNutrition(quantity, unit);
    
    res.json({
      ingredient: ingredient.name,
      quantity,
      unit,
      nutrition
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Calculate total nutrition for multiple ingredients
// @route   POST /api/ingredients/nutrition/calculate-recipe
// @access  Public
export const calculateRecipeNutrition = async (req, res) => {
  try {
    const { ingredients } = req.body;
    
    if (!ingredients || !Array.isArray(ingredients)) {
      return res.status(400).json({ message: 'Ingredients array is required' });
    }
    
    let totalNutrition = {
      calories: 0,
      protein: 0,
      fat: 0,
      carbs: 0
    };
    
    const ingredientDetails = [];
    
    for (const ing of ingredients) {
      const { name, quantity, unit } = ing;
      
      if (!name || !quantity || !unit) continue;
      
      const ingredient = await IngredientNutrition.findOne({
        $or: [
          { name: name.toLowerCase() },
          { aliases: name.toLowerCase() }
        ]
      });
      
      if (ingredient) {
        const nutrition = ingredient.calculateNutrition(quantity, unit);
        
        totalNutrition.calories += parseFloat(nutrition.calories);
        totalNutrition.protein += parseFloat(nutrition.protein);
        totalNutrition.fat += parseFloat(nutrition.fat);
        totalNutrition.carbs += parseFloat(nutrition.carbs);
        
        ingredientDetails.push({
          name: ingredient.name,
          quantity,
          unit,
          nutrition
        });
      }
    }
    
    // Round total values
    totalNutrition.calories = Math.round(totalNutrition.calories);
    totalNutrition.protein = Math.round(totalNutrition.protein * 10) / 10;
    totalNutrition.fat = Math.round(totalNutrition.fat * 10) / 10;
    totalNutrition.carbs = Math.round(totalNutrition.carbs * 10) / 10;
    
    res.json({
      totalNutrition,
      ingredientDetails
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create or update ingredient nutrition data (Admin)
// @route   POST /api/ingredients/nutrition
// @access  Private/Admin
export const createIngredientNutrition = async (req, res) => {
  try {
    const { name, caloriesPerUnit, proteinPerUnit, fatPerUnit, carbsPerUnit, standardUnit, aliases, conversions } = req.body;
    
    if (!name || caloriesPerUnit === undefined || proteinPerUnit === undefined || fatPerUnit === undefined || carbsPerUnit === undefined) {
      return res.status(400).json({ message: 'All nutrition fields are required' });
    }
    
    // Check if ingredient already exists
    const existing = await IngredientNutrition.findOne({ name: name.toLowerCase() });
    
    if (existing) {
      // Update existing
      existing.caloriesPerUnit = caloriesPerUnit;
      existing.proteinPerUnit = proteinPerUnit;
      existing.fatPerUnit = fatPerUnit;
      existing.carbsPerUnit = carbsPerUnit;
      existing.standardUnit = standardUnit || existing.standardUnit;
      if (aliases) existing.aliases = aliases;
      if (conversions) existing.conversions = new Map(Object.entries(conversions));
      
      await existing.save();
      res.json(existing);
    } else {
      // Create new
      const ingredient = await IngredientNutrition.create({
        name: name.toLowerCase(),
        caloriesPerUnit,
        proteinPerUnit,
        fatPerUnit,
        carbsPerUnit,
        standardUnit: standardUnit || '100g',
        aliases: aliases || [],
        conversions: conversions ? new Map(Object.entries(conversions)) : new Map()
      });
      
      res.status(201).json(ingredient);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
