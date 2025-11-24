import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Recipe from '../models/Recipe.js';
import User from '../models/User.js';
import Comment from '../models/Comment.js';

dotenv.config();

const seedRecipes = [
  {
    title: 'Classic Margherita Pizza',
    image: '/assets/pizza-margherita.jpg',
    cuisine: 'Italian',
    mealType: 'Dinner',
    difficulty: 'Medium',
    time: 45,
    rating: 4.8,
    ingredients: ['flour', 'tomato', 'mozzarella', 'basil', 'olive oil', 'yeast', 'salt'],
    steps: [
      'Prepare pizza dough and let it rise for 1 hour',
      'Roll out the dough into a circular shape',
      'Spread tomato sauce evenly on the dough',
      'Add fresh mozzarella slices',
      'Bake in preheated oven at 475°F for 12-15 minutes',
      'Garnish with fresh basil leaves and drizzle olive oil'
    ],
    nutrition: { calories: 285, protein: 12, fat: 10, carbs: 38 },
    tags: ['Italian', 'Pizza', 'Dinner'],
    isVegetarian: true
  },
  {
    title: 'Chicken Caesar Salad',
    image: '/assets/caesar-salad.jpg',
    cuisine: 'American',
    mealType: 'Lunch',
    difficulty: 'Easy',
    time: 20,
    rating: 4.5,
    ingredients: ['chicken breast', 'romaine lettuce', 'parmesan', 'croutons', 'caesar dressing', 'lemon'],
    steps: [
      'Grill or pan-fry chicken breast until cooked through',
      'Chop romaine lettuce into bite-sized pieces',
      'Slice cooked chicken into strips',
      'Toss lettuce with Caesar dressing',
      'Top with chicken strips, parmesan shavings, and croutons',
      'Squeeze fresh lemon juice over the salad'
    ],
    nutrition: { calories: 320, protein: 28, fat: 18, carbs: 15 },
    tags: ['Salad', 'Healthy', 'Lunch']
  },
  {
    title: 'Vegetable Stir Fry',
    image: '/assets/stir-fry.jpg',
    cuisine: 'Chinese',
    mealType: 'Dinner',
    difficulty: 'Easy',
    time: 25,
    rating: 4.6,
    ingredients: ['broccoli', 'carrot', 'bell pepper', 'onion', 'garlic', 'soy sauce', 'ginger', 'sesame oil'],
    steps: [
      'Chop all vegetables into uniform pieces',
      'Heat sesame oil in a wok over high heat',
      'Add garlic and ginger, stir-fry for 30 seconds',
      'Add harder vegetables (carrots, broccoli) first',
      'Add softer vegetables (bell peppers, onions)',
      'Season with soy sauce and serve hot'
    ],
    nutrition: { calories: 180, protein: 6, fat: 8, carbs: 24 },
    tags: ['Chinese', 'Vegetarian', 'Healthy'],
    isVegetarian: true,
    isVegan: true
  },
  {
    title: 'Beef Tacos',
    image: '/assets/beef-tacos.jpg',
    cuisine: 'Mexican',
    mealType: 'Dinner',
    difficulty: 'Easy',
    time: 30,
    rating: 4.9,
    ingredients: ['ground beef', 'taco shells', 'lettuce', 'tomato', 'cheese', 'sour cream', 'onion', 'taco seasoning'],
    steps: [
      'Brown ground beef in a skillet',
      'Add taco seasoning and water, simmer for 10 minutes',
      'Warm taco shells according to package directions',
      'Chop lettuce, tomatoes, and onions',
      'Fill shells with seasoned beef',
      'Top with lettuce, tomatoes, cheese, and sour cream'
    ],
    nutrition: { calories: 380, protein: 22, fat: 20, carbs: 28 },
    tags: ['Mexican', 'Dinner', 'Spicy']
  },
  {
    title: 'Blueberry Pancakes',
    image: '/assets/pancakes.jpg',
    cuisine: 'American',
    mealType: 'Breakfast',
    difficulty: 'Easy',
    time: 20,
    rating: 4.8,
    ingredients: ['flour', 'milk', 'egg', 'baking powder', 'blueberries', 'butter', 'maple syrup', 'sugar'],
    steps: [
      'Mix flour, baking powder, sugar, and salt',
      'Whisk together milk and eggs',
      'Combine wet and dry ingredients until just mixed',
      'Fold in fresh blueberries gently',
      'Cook pancakes on griddle until bubbles form',
      'Flip and cook until golden, serve with syrup'
    ],
    nutrition: { calories: 320, protein: 10, fat: 12, carbs: 46 },
    tags: ['Breakfast', 'Pancakes', 'Sweet'],
    isVegetarian: true
  }
];

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mystere-meal');
    console.log('MongoDB Connected');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Recipe.deleteMany({});
    await User.deleteMany({});
    await Comment.deleteMany({});

    console.log('Cleared existing data');

    // Create sample user
    const user = await User.create({
      name: 'Demo Chef',
      email: 'demo@mysteremeal.com',
      password: 'password123',
    });

    console.log('Created demo user');

    // Create recipes
    const recipes = await Recipe.insertMany(
      seedRecipes.map(recipe => ({
        ...recipe,
        author: user._id,
      }))
    );

    console.log(`Created ${recipes.length} recipes`);

    // Update user's created recipes
    user.createdRecipes = recipes.map(r => r._id);
    await user.save();

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
