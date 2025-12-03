import mongoose from 'mongoose';

const ingredientNutritionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  // Nutrition values per 100g or per unit
  caloriesPerUnit: {
    type: Number,
    required: true,
    min: 0
  },
  proteinPerUnit: {
    type: Number,
    required: true,
    min: 0
  },
  fatPerUnit: {
    type: Number,
    required: true,
    min: 0
  },
  carbsPerUnit: {
    type: Number,
    required: true,
    min: 0
  },
  // Standard unit for measurement (e.g., "100g", "1 piece", "1 cup")
  standardUnit: {
    type: String,
    required: true,
    default: '100g'
  },
  // Alternative names for ingredient matching
  aliases: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  // Common measurement conversions
  conversions: {
    type: Map,
    of: Number,
    default: new Map()
    // Example: { "cup": 240, "tbsp": 15, "tsp": 5 } for grams
  }
}, {
  timestamps: true
});

// Index for faster ingredient lookups
ingredientNutritionSchema.index({ aliases: 1 });

// Method to get nutrition for a specific quantity
ingredientNutritionSchema.methods.calculateNutrition = function(quantity, unit) {
  const conversionFactor = this.getConversionFactor(unit);
  const actualQuantity = quantity * conversionFactor;
  
  return {
    calories: (this.caloriesPerUnit * actualQuantity).toFixed(1),
    protein: (this.proteinPerUnit * actualQuantity).toFixed(1),
    fat: (this.fatPerUnit * actualQuantity).toFixed(1),
    carbs: (this.carbsPerUnit * actualQuantity).toFixed(1)
  };
};

// Get conversion factor for different units
ingredientNutritionSchema.methods.getConversionFactor = function(unit) {
  if (!unit || unit === this.standardUnit) return 1;
  return this.conversions.get(unit) || 1;
};

const IngredientNutrition = mongoose.model('IngredientNutrition', ingredientNutritionSchema);

export default IngredientNutrition;
