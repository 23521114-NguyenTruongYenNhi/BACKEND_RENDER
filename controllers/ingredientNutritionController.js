import IngredientNutrition from '../models/IngredientNutrition.js';

/**
 * Helper: Normalize input units to standard database keys.
 * Handles variations like "grams" -> "g", "whole" -> "piece".
 * @param {string} inputUnit 
 * @returns {string} Normalized unit key
 */
const normalizeUnit = (inputUnit) => {
    if (!inputUnit) return '';
    const unit = inputUnit.toLowerCase().trim();

    // Mapping common variations to standard DB keys
    const unitMap = {
        // Mass
        'gram': 'g', 'grams': 'g', 'gr': 'g', 'gms': 'g',
        'kilogram': 'kg', 'kilograms': 'kg', 'kilo': 'kg', 'kgs': 'kg',
        'ounce': 'oz', 'ounces': 'oz',
        'pound': 'lb', 'pounds': 'lb', 'lbs': 'lb',
        // Volume
        'milliliter': 'ml', 'milliliters': 'ml',
        'liter': 'l', 'liters': 'l',
        'tablespoon': 'tbsp', 'tablespoons': 'tbsp', 'tbs': 'tbsp',
        'teaspoon': 'tsp', 'teaspoons': 'tsp',
        'cup': 'cup', 'cups': 'cup',
        // Count/Quantity
        'piece': 'piece', 'pieces': 'piece', 'pc': 'piece', 'pcs': 'piece',
        'whole': 'piece', 'head': 'head', 'clove': 'clove', 'slice': 'slice',
        'stalk': 'stalk', 'stick': 'stick', 'fillet': 'fillet', 'can': 'can'
    };

    return unitMap[unit] || unit;
};

/**
 * Helper: Perform the actual nutrition calculation.
 * @param {Object} ingredient - Database document
 * @param {number|string} quantity - Input quantity
 * @param {string} unit - Input unit
 */
const performCalculation = (ingredient, quantity, unit) => {
    const qty = parseFloat(quantity);

    // Validate quantity
    if (isNaN(qty)) {
        console.log(`[WARN] Invalid quantity: ${quantity}`);
        return null;
    }

    // Normalize unit
    const cleanUnit = normalizeUnit(unit);

    // Retrieve conversion map from database (Handles both Map and Object structures)
    let conversions = {};
    if (ingredient.conversions instanceof Map) {
        conversions = Object.fromEntries(ingredient.conversions);
    } else {
        conversions = ingredient.conversions || {};
    }

    // Determine conversion factor
    // Priority 1: Exact match with normalized unit
    let factor = conversions[cleanUnit];

    // Priority 2: Exact match with original input
    if (!factor) {
        factor = conversions[unit.toLowerCase().trim()];
    }

    // Priority 3: Try singular form (remove trailing 's')
    if (!factor) {
        const singular = cleanUnit.replace(/s$/, '');
        factor = conversions[singular];
    }

    // Fallback: If unit matches the standard unit defined in DB, factor is 1
    if (!factor && cleanUnit === ingredient.standardUnit) {
        factor = 1;
    }

    // If still not found, log warning and return zero values
    if (!factor) {
        console.log(`[WARN] Conversion factor not found for unit: "${unit}" (Normalized: ${cleanUnit}) in ingredient: "${ingredient.name}". Available units: ${Object.keys(conversions).join(', ')}`);
        return { calories: 0, protein: 0, fat: 0, carbs: 0 };
    }

    // Calculation: (Base Nutrition) * (Quantity) * (Conversion Factor)
    // Note: Assuming base nutrition is per 100g (or 1 standard unit) and factor converts input to that standard.
    const totalStandardUnits = qty * factor;

    return {
        calories: Math.round(ingredient.caloriesPerUnit * totalStandardUnits),
        protein: parseFloat((ingredient.proteinPerUnit * totalStandardUnits).toFixed(1)),
        fat: parseFloat((ingredient.fatPerUnit * totalStandardUnits).toFixed(1)),
        carbs: parseFloat((ingredient.carbsPerUnit * totalStandardUnits).toFixed(1))
    };
};

// --- API CONTROLLERS ---

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
        const searchName = name.toLowerCase().trim();

        const ingredient = await IngredientNutrition.findOne({
            $or: [
                { name: searchName },
                { aliases: searchName }
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

// @desc    Calculate nutrition for a single ingredient
// @route   POST /api/ingredients/nutrition/calculate
// @access  Public
export const calculateIngredientNutrition = async (req, res) => {
    try {
        const { name, quantity, unit } = req.body;

        if (!name || quantity === undefined || !unit) {
            return res.status(400).json({ message: 'Name, quantity, and unit are required' });
        }

        const searchName = name.toLowerCase().trim();
        const ingredient = await IngredientNutrition.findOne({
            $or: [
                { name: searchName },
                { aliases: searchName }
            ]
        });

        if (!ingredient) {
            return res.json({
                ingredient: name,
                quantity,
                unit,
                nutrition: { calories: 0, protein: 0, fat: 0, carbs: 0 },
                notFound: true
            });
        }

        const nutrition = performCalculation(ingredient, quantity, unit);

        res.json({
            ingredient: ingredient.name,
            quantity,
            unit,
            nutrition
        });
    } catch (error) {
        console.error("[ERROR] Single calculation failed:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Calculate total nutrition for a recipe (Multiple ingredients)
// @route   POST /api/ingredients/nutrition/calculate-recipe
// @access  Public
export const calculateRecipeNutrition = async (req, res) => {
    try {
        const { ingredients } = req.body;

        console.log("[INFO] Received calculation request.");

        if (!ingredients || !Array.isArray(ingredients)) {
            return res.status(400).json({ message: 'Ingredients list is required and must be an array.' });
        }

        let totalNutrition = { calories: 0, protein: 0, fat: 0, carbs: 0 };
        const ingredientDetails = [];

        for (const ing of ingredients) {
            const { name, quantity, unit } = ing;

            // Validation: Skip if missing required fields
            if (!name || quantity === undefined || quantity === null || quantity === "" || !unit) {
                console.log(`[WARN] Skipping invalid item: ${JSON.stringify(ing)}`);
                ingredientDetails.push({ ...ing, error: "Missing required fields" });
                continue;
            }

            const searchName = name.toLowerCase().trim();

            // Database Lookup (Check Name or Alias)
            const ingredient = await IngredientNutrition.findOne({
                $or: [
                    { name: searchName },
                    { aliases: searchName }
                ]
            });

            if (ingredient) {
                console.log(`[INFO] Found ingredient in DB: "${ingredient.name}"`);

                // Perform Calculation
                const nutrition = performCalculation(ingredient, quantity, unit);

                if (nutrition) {
                    // Aggregate Totals
                    totalNutrition.calories += nutrition.calories;
                    totalNutrition.protein += nutrition.protein;
                    totalNutrition.fat += nutrition.fat;
                    totalNutrition.carbs += nutrition.carbs;

                    ingredientDetails.push({ name: ingredient.name, quantity, unit, nutrition });
                } else {
                    // Handle calculation error (e.g., invalid quantity)
                    ingredientDetails.push({
                        name, quantity, unit,
                        error: "Calculation failed",
                        nutrition: { calories: 0, protein: 0, fat: 0, carbs: 0 }
                    });
                }
            } else {
                console.log(`[INFO] Ingredient not found in DB: "${searchName}"`);
                ingredientDetails.push({
                    name: name,
                    quantity,
                    unit,
                    nutrition: { calories: 0, protein: 0, fat: 0, carbs: 0 },
                    notFound: true
                });
            }
        }

        // Round final totals for clean output
        totalNutrition.calories = Math.round(totalNutrition.calories);
        totalNutrition.protein = Math.round(totalNutrition.protein * 10) / 10;
        totalNutrition.fat = Math.round(totalNutrition.fat * 10) / 10;
        totalNutrition.carbs = Math.round(totalNutrition.carbs * 10) / 10;

        console.log("[INFO] Calculation complete. Sending response.");

        res.json({
            totalNutrition,
            ingredientDetails
        });

    } catch (error) {
        console.error("[ERROR] Recipe calculation error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Create or update ingredient nutrition data (Admin)
// @route   POST /api/ingredients/nutrition
// @access  Private/Admin
export const createIngredientNutrition = async (req, res) => {
    try {
        const { name, caloriesPerUnit, proteinPerUnit, fatPerUnit, carbsPerUnit, standardUnit, aliases, conversions } = req.body;

        if (!name) {
            return res.status(400).json({ message: 'Ingredient name is required' });
        }

        const existing = await IngredientNutrition.findOne({ name: name.toLowerCase() });

        const updateData = {
            name: name.toLowerCase(),
            caloriesPerUnit,
            proteinPerUnit,
            fatPerUnit,
            carbsPerUnit,
            standardUnit: standardUnit || '100g',
            aliases: aliases || [],
            conversions: conversions || {}
        };

        if (existing) {
            Object.assign(existing, updateData);
            await existing.save();
            res.json(existing);
        } else {
            const ingredient = await IngredientNutrition.create(updateData);
            res.status(201).json(ingredient);
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};