import Recipe from '../models/Recipe.js';
import Comment from '../models/Comment.js';

// @desc    Get all recipes
// @route   GET /api/recipes
// @access  Public
export const getRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({}).populate('author', 'name email');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search recipes by ingredients and filters
// @route   GET /api/recipes/search
// @access  Public
export const searchRecipes = async (req, res) => {
  try {
    const { ingredients, cuisine, mealType, difficulty, maxTime, minRating, isVegetarian, isVegan, isGlutenFree } = req.query;

    let query = {};

    // Search by ingredients (case-insensitive, partial match)
    if (ingredients) {
      const ingredientArray = ingredients.split(',').map(ing => ing.trim().toLowerCase());
      query.ingredients = {
        $in: ingredientArray.map(ing => new RegExp(ing, 'i'))
      };
    }

    // Apply filters
    if (cuisine) query.cuisine = cuisine;
    if (mealType) query.mealType = mealType;
    if (difficulty) query.difficulty = difficulty;
    if (maxTime) query.time = { $lte: parseInt(maxTime) };
    if (minRating) query.rating = { $gte: parseFloat(minRating) };
    if (isVegetarian === 'true') query.isVegetarian = true;
    if (isVegan === 'true') query.isVegan = true;
    if (isGlutenFree === 'true') query.isGlutenFree = true;

    const recipes = await Recipe.find(query).populate('author', 'name email');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recipe by ID
// @route   GET /api/recipes/:id
// @access  Public
export const getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('author', 'name email')
      .populate({
        path: 'comments',
        populate: { path: 'user', select: 'name' }
      });

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Private
export const createRecipe = async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      author: req.user._id,
    });

    const createdRecipe = await recipe.save();

    // Add to user's created recipes
    req.user.createdRecipes.push(createdRecipe._id);
    await req.user.save();

    res.status(201).json(createdRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private
export const updateRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user is the author
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this recipe' });
    }

    Object.assign(recipe, req.body);
    const updatedRecipe = await recipe.save();

    res.json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    // Check if user is the author
    if (recipe.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this recipe' });
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to recipe
// @route   POST /api/recipes/:id/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text, rating } = req.body;
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const comment = new Comment({
      user: req.user._id,
      recipe: recipe._id,
      text,
      rating,
    });

    const createdComment = await comment.save();

    recipe.comments.push(createdComment._id);
    await recipe.save();

    // Update recipe average rating
    const allComments = await Comment.find({ recipe: recipe._id });
    const avgRating = allComments.reduce((sum, c) => sum + c.rating, 0) / allComments.length;
    recipe.rating = Math.round(avgRating * 10) / 10;
    await recipe.save();

    const populatedComment = await Comment.findById(createdComment._id).populate('user', 'name');
    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
