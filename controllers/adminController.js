import Recipe from '../models/Recipe.js';
import User from '../models/User.js';

// @desc    Get all recipes filtered by status
// @route   GET /api/admin/recipes
// @access  Private/Admin
export const getRecipes = async (req, res) => {
  try {
    const { status } = req.query;
    
    const filter = status ? { status } : {};
    
    const recipes = await Recipe.find(filter)
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    res.status(500).json({ message: 'Server error while fetching recipes' });
  }
};

// @desc    Approve a recipe
// @route   POST /api/admin/recipes/:id/approve
// @access  Private/Admin
export const approveRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    recipe.status = 'approved';
    await recipe.save();
    
    res.json({ message: 'Recipe approved successfully', recipe });
  } catch (error) {
    console.error('Error approving recipe:', error);
    res.status(500).json({ message: 'Server error while approving recipe' });
  }
};

// @desc    Reject a recipe
// @route   POST /api/admin/recipes/:id/reject
// @access  Private/Admin
export const rejectRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    recipe.status = 'rejected';
    await recipe.save();
    
    res.json({ message: 'Recipe rejected successfully', recipe });
  } catch (error) {
    console.error('Error rejecting recipe:', error);
    res.status(500).json({ message: 'Server error while rejecting recipe' });
  }
};

// @desc    Delete a recipe
// @route   DELETE /api/admin/recipes/:id
// @access  Private/Admin
export const deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    await Recipe.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Error deleting recipe:', error);
    res.status(500).json({ message: 'Server error while deleting recipe' });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .populate('createdRecipes')
      .sort({ createdAt: -1 });
    
    // Add recipe count to each user
    const usersWithStats = users.map(user => ({
      id: user._id,
      name: user.name,
      email: user.email,
      recipesCount: user.createdRecipes.length,
      joinedAt: user.createdAt.toISOString().split('T')[0],
      isLocked: user.isLocked,
      isAdmin: user.isAdmin,
    }));
    
    res.json(usersWithStats);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Server error while fetching users' });
  }
};

// @desc    Lock a user account
// @route   POST /api/admin/users/:id/lock
// @access  Private/Admin
export const lockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Prevent locking admin accounts
    if (user.isAdmin) {
      return res.status(403).json({ message: 'Cannot lock admin accounts' });
    }
    
    user.isLocked = true;
    await user.save();
    
    res.json({ message: 'User account locked successfully', user: { id: user._id, isLocked: user.isLocked } });
  } catch (error) {
    console.error('Error locking user:', error);
    res.status(500).json({ message: 'Server error while locking user' });
  }
};

// @desc    Unlock a user account
// @route   POST /api/admin/users/:id/unlock
// @access  Private/Admin
export const unlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.isLocked = false;
    await user.save();
    
    res.json({ message: 'User account unlocked successfully', user: { id: user._id, isLocked: user.isLocked } });
  } catch (error) {
    console.error('Error unlocking user:', error);
    res.status(500).json({ message: 'Server error while unlocking user' });
  }
};
