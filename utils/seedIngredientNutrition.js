import mongoose from 'mongoose';
import dotenv from 'dotenv';
import IngredientNutrition from '../models/IngredientNutrition.js';
import connectDB from '../config/db.js';

dotenv.config();

// Comprehensive ingredient nutrition data (per 100g unless specified)
const ingredientNutritionData = [
  // Grains & Pasta
  {
    name: 'spaghetti',
    caloriesPerUnit: 371,
    proteinPerUnit: 13,
    fatPerUnit: 1.5,
    carbsPerUnit: 75,
    standardUnit: '100g',
    aliases: ['pasta', 'noodles'],
    conversions: { 'g': 0.01, 'cup': 1.4 }
  },
  {
    name: 'rice noodles',
    caloriesPerUnit: 109,
    proteinPerUnit: 1.8,
    fatPerUnit: 0.2,
    carbsPerUnit: 25,
    standardUnit: '100g',
    aliases: ['rice vermicelli', 'bánh phở'],
    conversions: { 'g': 0.01, 'cup': 1.76 }
  },
  {
    name: 'flour',
    caloriesPerUnit: 364,
    proteinPerUnit: 10,
    fatPerUnit: 1,
    carbsPerUnit: 76,
    standardUnit: '100g',
    aliases: ['all-purpose flour', 'wheat flour'],
    conversions: { 'g': 0.01, 'cup': 1.25 }
  },
  {
    name: 'quinoa',
    caloriesPerUnit: 120,
    proteinPerUnit: 4.4,
    fatPerUnit: 1.9,
    carbsPerUnit: 21,
    standardUnit: '100g',
    aliases: ['quinoa grain'],
    conversions: { 'g': 0.01, 'cup': 1.85 }
  },
  
  // Proteins
  {
    name: 'chicken breast',
    caloriesPerUnit: 165,
    proteinPerUnit: 31,
    fatPerUnit: 3.6,
    carbsPerUnit: 0,
    standardUnit: '100g',
    aliases: ['chicken', 'chicken meat'],
    conversions: { 'g': 0.01, 'oz': 0.28 }
  },
  {
    name: 'beef sirloin',
    caloriesPerUnit: 271,
    proteinPerUnit: 27,
    fatPerUnit: 17,
    carbsPerUnit: 0,
    standardUnit: '100g',
    aliases: ['beef', 'steak'],
    conversions: { 'g': 0.01, 'oz': 0.28 }
  },
  {
    name: 'ground beef',
    caloriesPerUnit: 250,
    proteinPerUnit: 26,
    fatPerUnit: 15,
    carbsPerUnit: 0,
    standardUnit: '100g',
    aliases: ['minced beef'],
    conversions: { 'g': 0.01, 'oz': 0.28, 'lb': 4.54 }
  },
  {
    name: 'pork shoulder',
    caloriesPerUnit: 242,
    proteinPerUnit: 20,
    fatPerUnit: 17,
    carbsPerUnit: 0,
    standardUnit: '100g',
    aliases: ['pork', 'pork meat'],
    conversions: { 'g': 0.01, 'oz': 0.28 }
  },
  {
    name: 'shrimp',
    caloriesPerUnit: 99,
    proteinPerUnit: 24,
    fatPerUnit: 0.3,
    carbsPerUnit: 0.2,
    standardUnit: '100g',
    aliases: ['prawn', 'shrimps'],
    conversions: { 'g': 0.01, 'oz': 0.28, 'piece': 0.15 }
  },
  {
    name: 'tofu',
    caloriesPerUnit: 76,
    proteinPerUnit: 8,
    fatPerUnit: 4.8,
    carbsPerUnit: 1.9,
    standardUnit: '100g',
    aliases: ['bean curd'],
    conversions: { 'g': 0.01, 'oz': 0.28, 'cup': 2.52 }
  },
  {
    name: 'eggs',
    caloriesPerUnit: 155,
    proteinPerUnit: 13,
    fatPerUnit: 11,
    carbsPerUnit: 1.1,
    standardUnit: '100g',
    aliases: ['egg'],
    conversions: { 'g': 0.01, 'whole': 0.5, 'large': 0.5 }
  },
  {
    name: 'chickpeas',
    caloriesPerUnit: 164,
    proteinPerUnit: 8.9,
    fatPerUnit: 2.6,
    carbsPerUnit: 27,
    standardUnit: '100g',
    aliases: ['garbanzo beans', 'chana'],
    conversions: { 'g': 0.01, 'cup': 1.64 }
  },
  
  // Dairy
  {
    name: 'mozzarella',
    caloriesPerUnit: 280,
    proteinPerUnit: 28,
    fatPerUnit: 17,
    carbsPerUnit: 3.1,
    standardUnit: '100g',
    aliases: ['mozzarella cheese'],
    conversions: { 'g': 0.01, 'oz': 0.28, 'cup': 1.13 }
  },
  {
    name: 'parmesan',
    caloriesPerUnit: 431,
    proteinPerUnit: 38,
    fatPerUnit: 29,
    carbsPerUnit: 4.1,
    standardUnit: '100g',
    aliases: ['parmesan cheese', 'parmigiano'],
    conversions: { 'g': 0.01, 'oz': 0.28, 'tbsp': 0.05 }
  },
  {
    name: 'pecorino romano cheese',
    caloriesPerUnit: 387,
    proteinPerUnit: 32,
    fatPerUnit: 27,
    carbsPerUnit: 3.6,
    standardUnit: '100g',
    aliases: ['pecorino', 'romano cheese'],
    conversions: { 'g': 0.01, 'oz': 0.28 }
  },
  {
    name: 'feta cheese',
    caloriesPerUnit: 264,
    proteinPerUnit: 14,
    fatPerUnit: 21,
    carbsPerUnit: 4.1,
    standardUnit: '100g',
    aliases: ['feta'],
    conversions: { 'g': 0.01, 'oz': 0.28, 'cup': 1.5 }
  },
  {
    name: 'yogurt',
    caloriesPerUnit: 59,
    proteinPerUnit: 10,
    fatPerUnit: 0.4,
    carbsPerUnit: 3.6,
    standardUnit: '100g',
    aliases: ['plain yogurt'],
    conversions: { 'g': 0.01, 'ml': 0.01, 'cup': 2.45 }
  },
  {
    name: 'heavy cream',
    caloriesPerUnit: 345,
    proteinPerUnit: 2.1,
    fatPerUnit: 37,
    carbsPerUnit: 2.8,
    standardUnit: '100ml',
    aliases: ['cream', 'whipping cream'],
    conversions: { 'ml': 0.01, 'cup': 2.38, 'tbsp': 0.15 }
  },
  
  // Vegetables
  {
    name: 'tomato',
    caloriesPerUnit: 18,
    proteinPerUnit: 0.9,
    fatPerUnit: 0.2,
    carbsPerUnit: 3.9,
    standardUnit: '100g',
    aliases: ['tomatoes'],
    conversions: { 'g': 0.01, 'whole': 1.23, 'cup': 1.49 }
  },
  {
    name: 'onions',
    caloriesPerUnit: 40,
    proteinPerUnit: 1.1,
    fatPerUnit: 0.1,
    carbsPerUnit: 9.3,
    standardUnit: '100g',
    aliases: ['onion', 'yellow onion'],
    conversions: { 'g': 0.01, 'whole': 1.1, 'cup': 1.6 }
  },
  {
    name: 'garlic',
    caloriesPerUnit: 149,
    proteinPerUnit: 6.4,
    fatPerUnit: 0.5,
    carbsPerUnit: 33,
    standardUnit: '100g',
    aliases: ['garlic cloves'],
    conversions: { 'g': 0.01, 'cloves': 0.03, 'tsp': 0.03 }
  },
  {
    name: 'bell pepper',
    caloriesPerUnit: 20,
    proteinPerUnit: 0.9,
    fatPerUnit: 0.2,
    carbsPerUnit: 4.6,
    standardUnit: '100g',
    aliases: ['sweet pepper', 'capsicum'],
    conversions: { 'g': 0.01, 'whole': 1.64, 'cup': 1.49 }
  },
  {
    name: 'carrot',
    caloriesPerUnit: 41,
    proteinPerUnit: 0.9,
    fatPerUnit: 0.2,
    carbsPerUnit: 10,
    standardUnit: '100g',
    aliases: ['carrots'],
    conversions: { 'g': 0.01, 'whole': 0.61, 'cup': 1.28 }
  },
  {
    name: 'cucumber',
    caloriesPerUnit: 15,
    proteinPerUnit: 0.7,
    fatPerUnit: 0.1,
    carbsPerUnit: 3.6,
    standardUnit: '100g',
    aliases: [],
    conversions: { 'g': 0.01, 'whole': 3.01 }
  },
  {
    name: 'lettuce',
    caloriesPerUnit: 15,
    proteinPerUnit: 1.4,
    fatPerUnit: 0.2,
    carbsPerUnit: 2.9,
    standardUnit: '100g',
    aliases: ['romaine lettuce', 'salad greens'],
    conversions: { 'g': 0.01, 'cup': 0.47 }
  },
  {
    name: 'broccoli',
    caloriesPerUnit: 34,
    proteinPerUnit: 2.8,
    fatPerUnit: 0.4,
    carbsPerUnit: 7,
    standardUnit: '100g',
    aliases: [],
    conversions: { 'g': 0.01, 'cup': 0.91 }
  },
  {
    name: 'kale',
    caloriesPerUnit: 49,
    proteinPerUnit: 4.3,
    fatPerUnit: 0.9,
    carbsPerUnit: 9,
    standardUnit: '100g',
    aliases: ['curly kale'],
    conversions: { 'g': 0.01, 'cup': 0.67 }
  },
  {
    name: 'sweet potato',
    caloriesPerUnit: 86,
    proteinPerUnit: 1.6,
    fatPerUnit: 0.1,
    carbsPerUnit: 20,
    standardUnit: '100g',
    aliases: ['sweet potatoes', 'yam'],
    conversions: { 'g': 0.01, 'whole': 1.3, 'cup': 1.33 }
  },
  {
    name: 'mushrooms',
    caloriesPerUnit: 22,
    proteinPerUnit: 3.1,
    fatPerUnit: 0.3,
    carbsPerUnit: 3.3,
    standardUnit: '100g',
    aliases: ['button mushrooms', 'white mushrooms'],
    conversions: { 'g': 0.01, 'cup': 0.7 }
  },
  {
    name: 'bean sprouts',
    caloriesPerUnit: 30,
    proteinPerUnit: 3,
    fatPerUnit: 0.2,
    carbsPerUnit: 6,
    standardUnit: '100g',
    aliases: ['mung bean sprouts'],
    conversions: { 'g': 0.01, 'cup': 1.04 }
  },
  {
    name: 'ginger',
    caloriesPerUnit: 80,
    proteinPerUnit: 1.8,
    fatPerUnit: 0.8,
    carbsPerUnit: 18,
    standardUnit: '100g',
    aliases: ['fresh ginger'],
    conversions: { 'g': 0.01, 'tbsp': 0.06, 'tsp': 0.02 }
  },
  
  // Fruits
  {
    name: 'lemon',
    caloriesPerUnit: 29,
    proteinPerUnit: 1.1,
    fatPerUnit: 0.3,
    carbsPerUnit: 9.3,
    standardUnit: '100g',
    aliases: ['lemons'],
    conversions: { 'g': 0.01, 'whole': 0.58, 'juice': 0.48 }
  },
  {
    name: 'lime',
    caloriesPerUnit: 30,
    proteinPerUnit: 0.7,
    fatPerUnit: 0.2,
    carbsPerUnit: 11,
    standardUnit: '100g',
    aliases: ['limes'],
    conversions: { 'g': 0.01, 'whole': 0.67 }
  },
  {
    name: 'avocado',
    caloriesPerUnit: 160,
    proteinPerUnit: 2,
    fatPerUnit: 15,
    carbsPerUnit: 9,
    standardUnit: '100g',
    aliases: ['avocados'],
    conversions: { 'g': 0.01, 'whole': 2.01 }
  },
  {
    name: 'pineapple',
    caloriesPerUnit: 50,
    proteinPerUnit: 0.5,
    fatPerUnit: 0.1,
    carbsPerUnit: 13,
    standardUnit: '100g',
    aliases: [],
    conversions: { 'g': 0.01, 'cup': 1.65 }
  },
  
  // Herbs & Aromatics
  {
    name: 'basil',
    caloriesPerUnit: 23,
    proteinPerUnit: 3.2,
    fatPerUnit: 0.6,
    carbsPerUnit: 2.7,
    standardUnit: '100g',
    aliases: ['fresh basil', 'sweet basil'],
    conversions: { 'g': 0.01, 'bunch': 0.25, 'cup': 0.21 }
  },
  {
    name: 'cilantro',
    caloriesPerUnit: 23,
    proteinPerUnit: 2.1,
    fatPerUnit: 0.5,
    carbsPerUnit: 3.7,
    standardUnit: '100g',
    aliases: ['coriander', 'chinese parsley'],
    conversions: { 'g': 0.01, 'bunch': 0.28, 'cup': 0.16 }
  },
  {
    name: 'thyme',
    caloriesPerUnit: 101,
    proteinPerUnit: 5.6,
    fatPerUnit: 1.7,
    carbsPerUnit: 24,
    standardUnit: '100g',
    aliases: ['fresh thyme'],
    conversions: { 'g': 0.01, 'sprig': 0.007, 'tsp': 0.008 }
  },
  
  // Meats
  {
    name: 'guanciale',
    caloriesPerUnit: 655,
    proteinPerUnit: 9,
    fatPerUnit: 69,
    carbsPerUnit: 0,
    standardUnit: '100g',
    aliases: ['cured pork jowl'],
    conversions: { 'g': 0.01, 'oz': 0.28 }
  },
  {
    name: 'bacon',
    caloriesPerUnit: 541,
    proteinPerUnit: 37,
    fatPerUnit: 42,
    carbsPerUnit: 1.4,
    standardUnit: '100g',
    aliases: ['smoked bacon'],
    conversions: { 'g': 0.01, 'oz': 0.28, 'strip': 0.1 }
  },
  
  // Condiments & Oils
  {
    name: 'olive oil',
    caloriesPerUnit: 884,
    proteinPerUnit: 0,
    fatPerUnit: 100,
    carbsPerUnit: 0,
    standardUnit: '100ml',
    aliases: ['extra virgin olive oil'],
    conversions: { 'ml': 0.01, 'tbsp': 0.15, 'tsp': 0.05 }
  },
  {
    name: 'sesame oil',
    caloriesPerUnit: 884,
    proteinPerUnit: 0,
    fatPerUnit: 100,
    carbsPerUnit: 0,
    standardUnit: '100ml',
    aliases: ['toasted sesame oil'],
    conversions: { 'ml': 0.01, 'tbsp': 0.15, 'tsp': 0.05 }
  },
  {
    name: 'soy sauce',
    caloriesPerUnit: 53,
    proteinPerUnit: 6,
    fatPerUnit: 0.1,
    carbsPerUnit: 4.9,
    standardUnit: '100ml',
    aliases: ['shoyu', 'light soy sauce'],
    conversions: { 'ml': 0.01, 'tbsp': 0.18, 'tsp': 0.06 }
  },
  {
    name: 'fish sauce',
    caloriesPerUnit: 35,
    proteinPerUnit: 5.1,
    fatPerUnit: 0.1,
    carbsPerUnit: 3.6,
    standardUnit: '100ml',
    aliases: ['nam pla', 'nuoc mam'],
    conversions: { 'ml': 0.01, 'tbsp': 0.15 }
  },
  {
    name: 'tomato sauce',
    caloriesPerUnit: 24,
    proteinPerUnit: 1.3,
    fatPerUnit: 0.2,
    carbsPerUnit: 5.3,
    standardUnit: '100ml',
    aliases: ['tomato puree', 'passata'],
    conversions: { 'ml': 0.01, 'cup': 2.45 }
  },
  {
    name: 'vinegar',
    caloriesPerUnit: 18,
    proteinPerUnit: 0,
    fatPerUnit: 0,
    carbsPerUnit: 0.04,
    standardUnit: '100ml',
    aliases: ['white vinegar', 'distilled vinegar'],
    conversions: { 'ml': 0.01, 'tbsp': 0.15, 'tsp': 0.05 }
  },
  {
    name: 'tamarind paste',
    caloriesPerUnit: 239,
    proteinPerUnit: 2.8,
    fatPerUnit: 0.6,
    carbsPerUnit: 63,
    standardUnit: '100g',
    aliases: ['tamarind concentrate'],
    conversions: { 'g': 0.01, 'tbsp': 0.16 }
  },
  {
    name: 'hummus',
    caloriesPerUnit: 166,
    proteinPerUnit: 8,
    fatPerUnit: 10,
    carbsPerUnit: 14,
    standardUnit: '100g',
    aliases: ['houmous'],
    conversions: { 'g': 0.01, 'cup': 2.46, 'tbsp': 0.15 }
  },
  {
    name: 'tahini',
    caloriesPerUnit: 595,
    proteinPerUnit: 17,
    fatPerUnit: 54,
    carbsPerUnit: 21,
    standardUnit: '100g',
    aliases: ['sesame paste'],
    conversions: { 'g': 0.01, 'tbsp': 0.15 }
  },
  
  // Spices (per tsp ~ 2g, normalized to 100g)
  {
    name: 'salt',
    caloriesPerUnit: 0,
    proteinPerUnit: 0,
    fatPerUnit: 0,
    carbsPerUnit: 0,
    standardUnit: '100g',
    aliases: ['table salt', 'sea salt'],
    conversions: { 'g': 0.01, 'tsp': 0.06, 'tbsp': 0.18 }
  },
  {
    name: 'black pepper',
    caloriesPerUnit: 251,
    proteinPerUnit: 10,
    fatPerUnit: 3.3,
    carbsPerUnit: 64,
    standardUnit: '100g',
    aliases: ['ground black pepper', 'pepper'],
    conversions: { 'g': 0.01, 'tsp': 0.023 }
  },
  {
    name: 'paprika',
    caloriesPerUnit: 282,
    proteinPerUnit: 14,
    fatPerUnit: 13,
    carbsPerUnit: 54,
    standardUnit: '100g',
    aliases: ['ground paprika'],
    conversions: { 'g': 0.01, 'tsp': 0.022 }
  },
  {
    name: 'cumin',
    caloriesPerUnit: 375,
    proteinPerUnit: 18,
    fatPerUnit: 22,
    carbsPerUnit: 44,
    standardUnit: '100g',
    aliases: ['ground cumin'],
    conversions: { 'g': 0.01, 'tsp': 0.021 }
  },
  {
    name: 'turmeric',
    caloriesPerUnit: 354,
    proteinPerUnit: 8,
    fatPerUnit: 10,
    carbsPerUnit: 65,
    standardUnit: '100g',
    aliases: ['ground turmeric'],
    conversions: { 'g': 0.01, 'tsp': 0.022 }
  },
  {
    name: 'garam masala',
    caloriesPerUnit: 379,
    proteinPerUnit: 14,
    fatPerUnit: 15,
    carbsPerUnit: 51,
    standardUnit: '100g',
    aliases: ['indian spice mix'],
    conversions: { 'g': 0.01, 'tsp': 0.019 }
  },
  {
    name: 'oregano',
    caloriesPerUnit: 265,
    proteinPerUnit: 9,
    fatPerUnit: 4.3,
    carbsPerUnit: 69,
    standardUnit: '100g',
    aliases: ['dried oregano'],
    conversions: { 'g': 0.01, 'tsp': 0.01 }
  },
  
  // Others
  {
    name: 'beef bones',
    caloriesPerUnit: 50,
    proteinPerUnit: 8,
    fatPerUnit: 2,
    carbsPerUnit: 0,
    standardUnit: '100g',
    aliases: ['beef marrow bones'],
    conversions: { 'g': 0.01, 'kg': 10 }
  },
  {
    name: 'star anise',
    caloriesPerUnit: 337,
    proteinPerUnit: 18,
    fatPerUnit: 16,
    carbsPerUnit: 50,
    standardUnit: '100g',
    aliases: ['whole star anise'],
    conversions: { 'g': 0.01, 'pieces': 0.03 }
  },
  {
    name: 'cinnamon stick',
    caloriesPerUnit: 247,
    proteinPerUnit: 4,
    fatPerUnit: 1.2,
    carbsPerUnit: 81,
    standardUnit: '100g',
    aliases: ['cinnamon', 'cassia'],
    conversions: { 'g': 0.01, 'piece': 0.025 }
  },
  {
    name: 'peanuts',
    caloriesPerUnit: 567,
    proteinPerUnit: 26,
    fatPerUnit: 49,
    carbsPerUnit: 16,
    standardUnit: '100g',
    aliases: ['roasted peanuts', 'groundnuts'],
    conversions: { 'g': 0.01, 'cup': 1.46 }
  }
];

const seedIngredientNutrition = async () => {
  try {
    await connectDB();

    // Clear existing data
    await IngredientNutrition.deleteMany({});
    console.log('✅ Cleared existing ingredient nutrition data');

    // Create ingredient nutrition data
    const createdIngredients = await IngredientNutrition.create(ingredientNutritionData);
    console.log(`✅ Created ${createdIngredients.length} ingredient nutrition records`);

    console.log('\n📊 Sample Ingredients:');
    createdIngredients.slice(0, 5).forEach(ing => {
      console.log(`- ${ing.name}: ${ing.caloriesPerUnit} cal/${ing.standardUnit}`);
    });

    console.log('\n🎉 Ingredient nutrition database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding ingredient nutrition database:', error);
    process.exit(1);
  }
};

seedIngredientNutrition();
