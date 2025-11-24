import User from '../models/User.js';
import Recipe from '../models/Recipe.js';

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Public
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('favorites')
      .populate('createdRecipes');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user favorites
// @route   GET /api/users/:id/favorites
// @access  Public
export const getUserFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('favorites');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.favorites);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add/Remove favorite recipe
// @route   POST /api/users/:id/favorites
// @access  Private
export const toggleFavorite = async (req, res) => {
  try {
    const { recipeId } = req.body;

    // Check if user is updating their own favorites
    if (req.params.id !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findById(req.params.id);
    const recipe = await Recipe.findById(recipeId);

    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }

    const isFavorited = user.favorites.includes(recipeId);

    if (isFavorited) {
      // Remove from favorites
      user.favorites = user.favorites.filter(
        (id) => id.toString() !== recipeId
      );
    } else {
      // Add to favorites
      user.favorites.push(recipeId);
    }

    await user.save();

    res.json({
      message: isFavorited ? 'Removed from favorites' : 'Added to favorites',
      favorites: user.favorites,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user's created recipes
// @route   GET /api/users/:id/recipes
// @access  Public
export const getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.params.id }).populate('author', 'name email');
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
