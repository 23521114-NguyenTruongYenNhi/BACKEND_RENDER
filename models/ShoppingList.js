import mongoose from 'mongoose';

const shoppingListItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    trim: true
  },
  checked: {
    type: Boolean,
    default: false
  },
  // Reference to recipe if added from recipe detail page
  recipeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Recipe',
    default: null
  },
  recipeName: {
    type: String,
    default: null
  },
  // Track if this is a missing ingredient from recipe
  isMissingIngredient: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ''
  }
});

const shoppingListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [shoppingListItemSchema],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for faster user lookups
shoppingListSchema.index({ user: 1 });

// Update lastUpdated on item changes
shoppingListSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Methods
shoppingListSchema.methods.addItem = function(item) {
  // Check if item already exists
  const existingItem = this.items.find(i => 
    i.name.toLowerCase() === item.name.toLowerCase() && 
    i.recipeId?.toString() === item.recipeId?.toString()
  );
  
  if (existingItem) {
    // Update quantity if same unit, otherwise add as separate item
    if (existingItem.unit === item.unit) {
      existingItem.quantity += item.quantity;
      return existingItem;
    }
  }
  
  this.items.push(item);
  return this.items[this.items.length - 1];
};

shoppingListSchema.methods.removeItem = function(itemId) {
  this.items = this.items.filter(item => item._id.toString() !== itemId);
};

shoppingListSchema.methods.toggleItemChecked = function(itemId) {
  const item = this.items.id(itemId);
  if (item) {
    item.checked = !item.checked;
  }
  return item;
};

shoppingListSchema.methods.clearCheckedItems = function() {
  this.items = this.items.filter(item => !item.checked);
};

shoppingListSchema.methods.getItemsByRecipe = function(recipeId) {
  return this.items.filter(item => 
    item.recipeId && item.recipeId.toString() === recipeId
  );
};

const ShoppingList = mongoose.model('ShoppingList', shoppingListSchema);

export default ShoppingList;
