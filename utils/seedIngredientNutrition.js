import mongoose from 'mongoose';
import dotenv from 'dotenv';
import IngredientNutrition from '../models/IngredientNutrition.js';

dotenv.config();


// Helper tạo dữ liệu chuẩn
const createIng = (name, cal, pro, fat, carb, unit = '100g', aliases = [], conversions = {}) => ({
    name,
    caloriesPerUnit: cal,
    proteinPerUnit: pro,
    fatPerUnit: fat,
    carbsPerUnit: carb,
    standardUnit: unit,
    aliases: [...new Set([...aliases, name, name.toLowerCase()])],
    conversions: {
        'g': 0.01, 'kg': 10, 'oz': 0.2835, 'lb': 4.53,
        ...conversions
    }
});

const ingredientNutritionData = [
    // --- 1. VEGETABLES (Rau củ) ---
    createIng('tomato', 18, 0.9, 0.2, 3.9, '100g', ['tomatoes'], { 'medium': 1.2, 'cup': 1.8, 'slice': 0.2 }),
    createIng('onion', 40, 1.1, 0.1, 9.3, '100g', ['onions'], { 'medium': 1.1, 'cup': 1.6 }),
    createIng('garlic', 149, 6.4, 0.5, 33, '100g', [], { 'clove': 0.03, 'bulb': 0.3, 'tsp': 0.03 }),
    createIng('potato', 77, 2, 0.1, 17, '100g', ['potatoes'], { 'medium': 1.5, 'cup': 1.5 }),
    createIng('carrot', 41, 0.9, 0.2, 10, '100g', ['carrots'], { 'medium': 0.6, 'cup': 1.2 }),
    createIng('celery', 16, 0.7, 0.2, 3, '100g', [], { 'stalk': 0.4, 'cup': 1.0 }),
    createIng('bell pepper', 20, 0.9, 0.2, 4.6, '100g', ['capsicum'], { 'medium': 1.2, 'cup': 1.5 }),
    createIng('broccoli', 34, 2.8, 0.4, 7, '100g', [], { 'head': 4.0, 'cup': 0.9 }),
    createIng('cauliflower', 25, 1.9, 0.3, 5, '100g', [], { 'head': 5.0, 'cup': 1.0 }),
    createIng('zucchini', 17, 1.2, 0.3, 3.1, '100g', [], { 'medium': 2.0, 'cup': 1.2 }),
    createIng('eggplant', 25, 1, 0.2, 6, '100g', ['aubergine'], { 'medium': 4.5, 'cup': 0.8 }),
    createIng('spinach', 23, 2.9, 0.4, 3.6, '100g', [], { 'cup': 0.3, 'bunch': 3.4 }),
    createIng('lettuce', 15, 1.4, 0.2, 2.9, '100g', [], { 'head': 3.0, 'cup': 0.4 }),
    createIng('cabbage', 25, 1.3, 0.1, 6, '100g', [], { 'head': 9.0, 'cup': 0.9 }),
    createIng('cucumber', 15, 0.7, 0.1, 3.6, '100g', [], { 'medium': 2.0, 'cup': 1.2 }),
    createIng('mushroom', 22, 3.1, 0.3, 3.3, '100g', ['mushrooms'], { 'cup': 0.7 }),
    createIng('corn', 86, 3.2, 1.2, 19, '100g', [], { 'ear': 0.9, 'cup': 1.6 }),
    createIng('peas', 81, 5, 0.4, 14, '100g', [], { 'cup': 1.4 }),
    createIng('green beans', 31, 1.8, 0.2, 7, '100g', [], { 'cup': 1.0 }),
    createIng('asparagus', 20, 2.2, 0.1, 4, '100g', [], { 'spear': 0.2, 'bunch': 4.0 }),
    createIng('brussels sprouts', 43, 3.4, 0.3, 9, '100g', [], { 'cup': 0.9 }),
    createIng('kale', 49, 4.3, 0.9, 9, '100g', [], { 'cup': 0.67 }),
    createIng('bok choy', 13, 1.5, 0.2, 2, '100g', [], { 'head': 1.5, 'cup': 0.7 }),
    createIng('leek', 61, 1.5, 0.3, 14, '100g', [], { 'stalk': 0.9 }),
    createIng('radish', 16, 0.7, 0.1, 3.4, '100g', [], { 'medium': 0.05, 'cup': 1.1 }),
    createIng('beet', 43, 1.6, 0.2, 10, '100g', ['beetroot'], { 'medium': 0.8, 'cup': 1.3 }),
    createIng('sweet potato', 86, 1.6, 0.1, 20, '100g', [], { 'medium': 1.3, 'cup': 1.3 }),
    createIng('pumpkin', 26, 1, 0.1, 6.5, '100g', [], { 'cup': 1.1 }),
    createIng('squash', 45, 1, 0.1, 12, '100g', [], { 'medium': 4.0, 'cup': 2.0 }),

    // --- 2. PROTEINS (Thịt, Cá, Trứng) ---
    createIng('chicken', 165, 31, 3.6, 0, '100g', ['chicken breast'], { 'breast': 2.0, 'cup': 1.4 }),
    createIng('beef', 250, 26, 17, 0, '100g', ['ground beef', 'steak'], { 'patty': 1.5, 'steak': 2.5 }),
    createIng('pork', 242, 27, 14, 0, '100g', ['pork chop'], { 'chop': 1.5 }),
    createIng('lamb', 294, 25, 21, 0, '100g', [], { 'chop': 1.2 }),
    createIng('turkey', 189, 29, 7, 0, '100g', [], { 'slice': 0.3 }),
    createIng('duck', 337, 19, 28, 0, '100g', [], { 'breast': 2.0 }),
    createIng('salmon', 208, 20, 13, 0, '100g', [], { 'fillet': 1.5 }),
    createIng('tuna', 132, 28, 1, 0, '100g', [], { 'can': 1.5, 'steak': 1.7 }),
    createIng('shrimp', 99, 24, 0.3, 0.2, '100g', ['prawns'], { 'piece': 0.15 }),
    createIng('cod', 82, 18, 0.7, 0, '100g', [], { 'fillet': 1.5 }),
    createIng('tilapia', 96, 20, 1.7, 0, '100g', [], { 'fillet': 1.2 }),
    createIng('crab', 83, 18, 0.7, 0, '100g', ['crab meat'], { 'cup': 1.3 }),
    createIng('lobster', 89, 19, 0.9, 0, '100g', [], { 'tail': 1.5 }),
    createIng('tofu', 76, 8, 4.8, 1.9, '100g', [], { 'block': 3.0, 'piece': 0.5 }),
    createIng('tempeh', 192, 20, 11, 8, '100g', [], { 'cup': 1.6 }),
    createIng('eggs', 155, 13, 11, 1.1, '100g', ['egg'], { 'whole': 0.5, 'large': 0.5 }),
    createIng('bacon', 541, 37, 42, 1.4, '100g', [], { 'strip': 0.15, 'slice': 0.15 }),
    createIng('sausage', 300, 12, 27, 2, '100g', [], { 'link': 0.5 }),
    createIng('ham', 145, 21, 6, 1.5, '100g', [], { 'slice': 0.3 }),

    // --- 3. DAIRY (Sữa & Phô mai) ---
    createIng('milk', 42, 3.4, 1, 5, '100ml', [], { 'cup': 2.45, 'tbsp': 0.15 }),
    createIng('butter', 717, 0.9, 81, 0.1, '100g', [], { 'stick': 1.13, 'tbsp': 0.14 }),
    createIng('cheese', 403, 25, 33, 1.3, '100g', ['cheddar'], { 'slice': 0.28, 'cup': 1.1 }),
    createIng('cream', 340, 2.8, 36, 2.7, '100ml', ['heavy cream'], { 'cup': 2.4, 'tbsp': 0.15 }),
    createIng('yogurt', 59, 10, 0.4, 3.6, '100g', [], { 'cup': 2.45, 'pot': 1.25 }),
    createIng('sour cream', 193, 2.1, 19, 2.9, '100g', [], { 'tbsp': 0.15, 'cup': 2.3 }),
    createIng('mozzarella', 280, 28, 17, 3.1, '100g', [], { 'slice': 0.2, 'cup': 1.1 }),
    createIng('parmesan', 431, 38, 29, 4.1, '100g', [], { 'tbsp': 0.05 }),
    createIng('feta', 264, 14, 21, 4, '100g', [], { 'cup': 1.5, 'block': 2.0 }),
    createIng('ricotta', 174, 11, 13, 3, '100g', [], { 'cup': 2.5 }),
    createIng('cream cheese', 342, 6, 34, 4, '100g', [], { 'tbsp': 0.15, 'block': 2.2 }),

    // --- 4. GRAINS & PASTA (Tinh bột) ---
    createIng('rice', 130, 2.7, 0.3, 28, '100g', [], { 'cup': 1.95, 'bowl': 2.0 }),
    createIng('pasta', 131, 5, 1.1, 25, '100g', ['noodles'], { 'cup': 1.4 }),
    createIng('spaghetti', 371, 13, 1.5, 75, '100g', [], { 'serving': 0.8 }),
    createIng('bread', 265, 9, 3.2, 49, '100g', [], { 'slice': 0.3, 'piece': 0.8 }),
    createIng('flour', 364, 10, 1, 76, '100g', [], { 'cup': 1.25, 'tbsp': 0.08 }),
    createIng('quinoa', 120, 4.4, 1.9, 21, '100g', [], { 'cup': 1.85 }),
    createIng('oats', 389, 16.9, 6.9, 66, '100g', [], { 'cup': 0.9 }),
    createIng('couscous', 112, 3.8, 0.2, 23, '100g', [], { 'cup': 1.7 }),
    createIng('barley', 123, 2.3, 0.4, 28, '100g', [], { 'cup': 1.8 }),

    // --- 5. LEGUMES & NUTS (Đậu & Hạt) ---
    createIng('lentils', 116, 9, 0.4, 20, '100g', [], { 'cup': 2.0 }),
    createIng('chickpeas', 164, 9, 2.6, 27, '100g', [], { 'cup': 1.6, 'can': 4.0 }),
    createIng('black beans', 132, 9, 0.5, 24, '100g', [], { 'cup': 1.7 }),
    createIng('kidney beans', 127, 9, 0.5, 23, '100g', [], { 'cup': 1.8 }),
    createIng('almonds', 579, 21, 50, 22, '100g', [], { 'cup': 1.4, 'tbsp': 0.09 }),
    createIng('walnuts', 654, 15, 65, 14, '100g', [], { 'cup': 1.2 }),
    createIng('cashews', 553, 18, 44, 30, '100g', [], { 'cup': 1.3 }),
    createIng('peanuts', 567, 26, 49, 16, '100g', [], { 'cup': 1.46 }),
    createIng('pine nuts', 673, 14, 68, 13, '100g', [], { 'tbsp': 0.1 }),

    // --- 6. FRUITS (Trái cây) ---
    createIng('lemon', 29, 1.1, 0.3, 9, '100g', [], { 'whole': 0.6, 'juice': 0.5 }),
    createIng('lime', 30, 0.7, 0.2, 11, '100g', [], { 'whole': 0.6, 'juice': 0.4 }),
    createIng('orange', 47, 0.9, 0.1, 12, '100g', [], { 'medium': 1.3 }),
    createIng('apple', 52, 0.3, 0.2, 14, '100g', [], { 'medium': 1.8 }),
    createIng('banana', 89, 1.1, 0.3, 23, '100g', [], { 'medium': 1.2 }),
    createIng('strawberry', 32, 0.7, 0.3, 7.7, '100g', [], { 'cup': 1.5 }),
    createIng('blueberry', 57, 0.7, 0.3, 14, '100g', [], { 'cup': 1.5 }),
    createIng('mango', 60, 0.8, 0.4, 15, '100g', [], { 'whole': 3.3, 'cup': 1.6 }),
    createIng('pineapple', 50, 0.5, 0.1, 13, '100g', [], { 'cup': 1.6 }),
    createIng('avocado', 160, 2, 15, 9, '100g', [], { 'whole': 2.0, 'cup': 1.5 }),
    createIng('coconut', 354, 3.3, 33, 15, '100g', [], { 'cup': 0.8 }),

    // --- 7. HERBS & SPICES (Gia vị & Rau thơm) ---
    createIng('basil', 23, 3, 0.6, 2.7, '100g', [], { 'cup': 0.1, 'bunch': 0.5 }),
    createIng('parsley', 36, 3, 0.8, 6, '100g', [], { 'cup': 0.1, 'bunch': 0.5 }),
    createIng('cilantro', 23, 2, 0.5, 3.7, '100g', [], { 'cup': 0.1, 'bunch': 0.5 }),
    createIng('mint', 70, 3.8, 0.9, 15, '100g', [], { 'cup': 0.1 }),
    createIng('rosemary', 131, 3.3, 5.9, 20, '100g', [], { 'sprig': 0.02 }),
    createIng('thyme', 101, 5.6, 1.7, 24, '100g', [], { 'sprig': 0.01 }),
    createIng('ginger', 80, 1.8, 0.8, 18, '100g', [], { 'thumb': 0.2, 'tsp': 0.02 }),
    createIng('salt', 0, 0, 0, 0, '100g', [], { 'tsp': 0.06 }),
    createIng('black pepper', 251, 10, 3, 64, '100g', [], { 'tsp': 0.02 }),
    createIng('paprika', 282, 14, 13, 54, '100g', [], { 'tsp': 0.02 }),
    createIng('cumin', 375, 18, 22, 44, '100g', [], { 'tsp': 0.02 }),
    createIng('cinnamon', 247, 4, 1.2, 81, '100g', [], { 'tsp': 0.02, 'stick': 0.05 }),
    createIng('turmeric', 354, 8, 10, 65, '100g', [], { 'tsp': 0.02 }),

    // --- 8. CONDIMENTS (Gia vị lỏng) ---
    createIng('olive oil', 884, 0, 100, 0, '100ml', [], { 'tbsp': 0.14, 'tsp': 0.05 }),
    createIng('vegetable oil', 884, 0, 100, 0, '100ml', [], { 'tbsp': 0.14 }),
    createIng('sesame oil', 884, 0, 100, 0, '100ml', [], { 'tbsp': 0.14 }),
    createIng('soy sauce', 53, 6, 0, 5, '100ml', [], { 'tbsp': 0.16 }),
    createIng('fish sauce', 35, 5, 0, 3, '100ml', [], { 'tbsp': 0.18 }),
    createIng('vinegar', 18, 0, 0, 0.1, '100ml', [], { 'tbsp': 0.15 }),
    createIng('ketchup', 101, 1, 0, 27, '100g', [], { 'tbsp': 0.15 }),
    createIng('mayonnaise', 680, 1, 75, 1, '100g', [], { 'tbsp': 0.14 }),
    createIng('mustard', 66, 4, 3, 6, '100g', [], { 'tbsp': 0.15 }),
    createIng('honey', 304, 0.3, 0, 82, '100g', [], { 'tbsp': 0.21, 'cup': 3.4 }),
    createIng('maple syrup', 260, 0, 0, 67, '100g', [], { 'tbsp': 0.2, 'cup': 3.2 }),
    createIng('sugar', 387, 0, 0, 100, '100g', ['white sugar'], { 'tbsp': 0.12, 'cup': 2.0 }),
    createIng('brown sugar', 380, 0, 0, 98, '100g', [], { 'tbsp': 0.12, 'cup': 2.0 }),

    // --- 9. ASIAN INGREDIENTS ---
    createIng('lemongrass', 99, 1.8, 0.5, 25, '100g', [], { 'stalk': 0.3 }),
    createIng('galangal', 71, 1, 1, 15, '100g', [], { 'thumb': 0.2 }),
    createIng('miso paste', 198, 12, 6, 25, '100g', [], { 'tbsp': 0.18 }),
    createIng('gochujang', 230, 5, 2, 45, '100g', [], { 'tbsp': 0.18 }),
    createIng('coconut milk', 230, 2.3, 24, 6, '100ml', [], { 'cup': 2.4, 'can': 4.0 }),
    createIng('kimchi', 15, 1.1, 0.5, 2.4, '100g', [], { 'cup': 1.5 }),

    // --- 10. BAKING ---
    createIng('baking powder', 53, 0, 0, 28, '100g', [], { 'tsp': 0.04 }),
    createIng('baking soda', 0, 0, 0, 0, '100g', [], { 'tsp': 0.04 }),
    createIng('yeast', 325, 40, 7, 41, '100g', [], { 'tsp': 0.03, 'packet': 0.07 }),
    createIng('vanilla extract', 288, 0, 0, 13, '100ml', [], { 'tsp': 0.04 }),
    createIng('cocoa powder', 228, 20, 14, 58, '100g', [], { 'cup': 0.86 }),
    createIng('chocolate chips', 479, 4, 28, 63, '100g', [], { 'cup': 1.7 }),
    createIng('cornstarch', 381, 0.3, 0.1, 91, '100g', [], { 'tbsp': 0.08 }),

    // --- 11. OTHERS ---
    createIng('stock', 5, 0.5, 0.1, 0.5, '100ml', ['broth'], { 'cup': 2.4 }),
    createIng('wine', 82, 0.1, 0, 2.6, '100ml', [], { 'cup': 2.4 }),
    createIng('beer', 43, 0.5, 0, 3.6, '100ml', [], { 'can': 3.3 }),
    createIng('tomato paste', 82, 4, 0.5, 19, '100g', [], { 'tbsp': 0.16 }),
    createIng('tomato sauce', 29, 1.3, 0.2, 5, '100g', [], { 'cup': 2.45 }),
    createIng('olives', 115, 0.8, 10.7, 6, '100g', [], { 'cup': 1.3 }),
    createIng('sun-dried tomatoes', 258, 14, 3, 56, '100g', [], { 'cup': 0.5 }),
    createIng('anchovies', 210, 29, 10, 0, '100g', [], { 'fillet': 0.04 }),
    createIng('capers', 23, 2, 0.9, 5, '100g', [], { 'tbsp': 0.09 })
];

const seedIngredientNutrition = async () => {
    try {
        console.log('Đang kết nối MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('✅ MongoDB Connected');

        console.log('Đang nạp dữ liệu (Upsert Mode)...');

        const operations = ingredientNutritionData.map(item => ({
            updateOne: {
                filter: { name: item.name },
                update: { $set: item },
                upsert: true
            }
        }));

        if (operations.length > 0) {
            const result = await IngredientNutrition.bulkWrite(operations);
            console.log(`Thành công!`);
            console.log(`   - Modified: ${result.modifiedCount}`);
            console.log(`   - Inserted: ${result.upsertedCount}`);
        }

        console.log('Database dinh dưỡng đã sẵn sàng! (100+ Ingredients)');
        process.exit(0);
    } catch (error) {
        console.error('Lỗi:', error);
        process.exit(1);
    }
};

seedIngredientNutrition();