import mongoose from 'mongoose';
import dotenv from 'dotenv';
import IngredientNutrition from '../models/IngredientNutrition.js';
import connectDB from '../config/db.js';

dotenv.config();
const MONGO_URI = "mongodb+srv://23521114_db_user:MasB80RaCs9oBB18@cluster0.qzsvxay.mongodb.net/mystere-meal?appName=Cluster0";

// Helper tạo dữ liệu chuẩn xác
const createIng = (name, cal, pro, fat, carb, unit = '100g', aliases = [], conversions = {}) => ({
    name,
    caloriesPerUnit: cal,
    proteinPerUnit: pro,
    fatPerUnit: fat,
    carbsPerUnit: carb,
    standardUnit: unit,
    // Tự động thêm tên chính nó vào alias và xóa trùng lặp
    aliases: [...new Set([...aliases, name, name.toLowerCase()])],
    // Các đơn vị đo lường mặc định
    conversions: {
        'g': 0.01,
        'kg': 10,
        'oz': 0.2835,
        'lb': 4.53,
        ...conversions
    }
});

const ingredientNutritionData = [
    // =================================================================
    // 1. RAU CỦ & NẤM (VEGETABLES & MUSHROOMS)
    // =================================================================
    createIng('onion', 40, 1.1, 0.1, 9, '100g', ['hành tây'], { 'whole': 1.1, 'medium': 1.1, 'cup': 1.6 }),
    createIng('garlic', 149, 6.4, 0.5, 33, '100g', ['tỏi'], { 'clove': 0.03, 'bulb': 0.3 }),
    createIng('carrot', 41, 0.9, 0.2, 10, '100g', ['cà rốt'], { 'medium': 0.61, 'cup': 1.28 }),
    createIng('potato', 77, 2, 0.1, 17, '100g', ['khoai tây'], { 'medium': 1.5, 'cup': 1.5 }),
    createIng('sweet potato', 86, 1.6, 0.1, 20, '100g', ['khoai lang'], { 'medium': 1.3 }),
    createIng('tomato', 18, 0.9, 0.2, 3.9, '100g', ['cà chua'], { 'medium': 1.23, 'cup': 1.8 }),
    createIng('cucumber', 15, 0.7, 0.1, 3.6, '100g', ['dưa leo'], { 'medium': 2.0, 'cup': 1.2 }),
    createIng('bell pepper', 20, 0.9, 0.2, 4.6, '100g', ['ớt chuông'], { 'medium': 1.2, 'cup': 1.5 }),
    createIng('broccoli', 34, 2.8, 0.4, 7, '100g', ['súp lơ xanh'], { 'head': 4.0, 'cup': 0.9 }),
    createIng('cauliflower', 25, 1.9, 0.3, 5, '100g', ['súp lơ trắng'], { 'head': 5.0, 'cup': 1.0 }),
    createIng('spinach', 23, 2.9, 0.4, 3.6, '100g', ['cải bó xôi', 'rau chân vịt'], { 'cup': 0.3, 'bag': 2.5 }),
    createIng('kale', 49, 4.3, 0.9, 9, '100g', ['cải xoăn'], { 'cup': 0.67 }),
    createIng('lettuce', 15, 1.4, 0.2, 2.9, '100g', ['xà lách'], { 'head': 3.0, 'cup': 0.4 }),
    createIng('cabbage', 25, 1.3, 0.1, 6, '100g', ['bắp cải'], { 'head': 9.0, 'cup': 0.9 }),
    createIng('bok choy', 13, 1.5, 0.2, 2, '100g', ['cải thìa'], { 'head': 1.5, 'cup': 0.7 }),
    createIng('mushroom', 22, 3.1, 0.3, 3.3, '100g', ['nấm', 'button mushroom'], { 'cup': 0.7 }),
    createIng('shiitake', 34, 2.2, 0.5, 6.8, '100g', ['nấm hương'], { 'whole': 0.2 }),
    createIng('zucchini', 17, 1.2, 0.3, 3.1, '100g', ['bí ngòi'], { 'medium': 1.96, 'cup': 1.2 }),
    createIng('eggplant', 25, 1, 0.2, 6, '100g', ['cà tím'], { 'medium': 4.5, 'cup': 0.8 }),
    createIng('corn', 86, 3.2, 1.2, 19, '100g', ['ngô', 'bắp'], { 'ear': 0.9, 'cup': 1.6 }),
    createIng('green beans', 31, 1.8, 0.2, 7, '100g', ['đậu que'], { 'cup': 1.0 }),
    createIng('peas', 81, 5, 0.4, 14, '100g', ['đậu hà lan'], { 'cup': 1.4 }),
    createIng('asparagus', 20, 2.2, 0.1, 4, '100g', ['măng tây'], { 'spear': 0.2, 'bunch': 4.0 }),
    createIng('celery', 16, 0.7, 0.2, 3, '100g', ['cần tây'], { 'stalk': 0.4, 'cup': 1.0 }),
    createIng('ginger', 80, 1.8, 0.8, 18, '100g', ['gừng'], { 'thumb': 0.2, 'tsp': 0.02 }),
    createIng('lemongrass', 99, 1.8, 0.5, 25, '100g', ['sả'], { 'stalk': 0.3 }),
    createIng('bamboo shoots', 27, 2.6, 0.3, 5, '100g', ['măng'], { 'cup': 1.5 }),
    createIng('bean sprouts', 30, 3, 0.2, 6, '100g', ['giá đỗ'], { 'cup': 0.9 }),

    // =================================================================
    // 2. TRÁI CÂY (FRUITS)
    // =================================================================
    createIng('apple', 52, 0.3, 0.2, 14, '100g', ['táo'], { 'medium': 1.8, 'cup': 1.1 }),
    createIng('banana', 89, 1.1, 0.3, 23, '100g', ['chuối'], { 'medium': 1.2 }),
    createIng('orange', 47, 0.9, 0.1, 12, '100g', ['cam'], { 'medium': 1.3 }),
    createIng('lemon', 29, 1.1, 0.3, 9, '100g', ['chanh vàng'], { 'whole': 0.6, 'juice': 0.5 }),
    createIng('lime', 30, 0.7, 0.2, 11, '100g', ['chanh xanh'], { 'whole': 0.6, 'juice': 0.4 }),
    createIng('avocado', 160, 2, 15, 9, '100g', ['bơ'], { 'whole': 2.0, 'cup': 1.5 }),
    createIng('strawberry', 32, 0.7, 0.3, 7.7, '100g', ['dâu tây'], { 'cup': 1.5 }),
    createIng('blueberry', 57, 0.7, 0.3, 14, '100g', ['việt quất'], { 'cup': 1.5 }),
    createIng('mango', 60, 0.8, 0.4, 15, '100g', ['xoài'], { 'whole': 3.3, 'cup': 1.6 }),
    createIng('pineapple', 50, 0.5, 0.1, 13, '100g', ['dứa', 'thơm'], { 'cup': 1.6 }),
    createIng('watermelon', 30, 0.6, 0.2, 8, '100g', ['dưa hấu'], { 'wedge': 2.8, 'cup': 1.5 }),
    createIng('coconut', 354, 3.3, 33, 15, '100g', ['dừa'], { 'cup': 0.8 }),

    // =================================================================
    // 3. THỊT, CÁ & TRỨNG (PROTEINS)
    // =================================================================
    createIng('chicken breast', 165, 31, 3.6, 0, '100g', ['ức gà', 'thịt gà'], { 'breast': 2.0, 'cup': 1.4 }),
    createIng('chicken thigh', 209, 26, 11, 0, '100g', ['đùi gà'], { 'thigh': 1.5 }),
    createIng('chicken wings', 203, 30, 8, 0, '100g', ['cánh gà'], { 'wing': 0.9 }),
    createIng('beef', 250, 26, 17, 0, '100g', ['thịt bò', 'ground beef'], { 'patty': 1.5, 'steak': 2.5 }),
    createIng('pork', 242, 27, 14, 0, '100g', ['thịt heo', 'pork chop'], { 'chop': 1.5 }),
    createIng('bacon', 541, 37, 42, 1.4, '100g', ['thịt xông khói'], { 'strip': 0.15, 'slice': 0.15 }),
    createIng('sausage', 300, 12, 27, 2, '100g', ['xúc xích'], { 'link': 0.5 }),
    createIng('salmon', 208, 20, 13, 0, '100g', ['cá hồi'], { 'fillet': 1.5 }),
    createIng('tuna', 132, 28, 1, 0, '100g', ['cá ngừ'], { 'can': 1.5, 'steak': 1.7 }),
    createIng('shrimp', 99, 24, 0.3, 0.2, '100g', ['tôm'], { 'piece': 0.15 }),
    createIng('eggs', 155, 13, 11, 1.1, '100g', ['trứng gà'], { 'whole': 0.5, 'large': 0.5 }),
    createIng('tofu', 76, 8, 4.8, 1.9, '100g', ['đậu phụ', 'bean curd'], { 'block': 3.0, 'piece': 0.5 }),
    createIng('tempeh', 192, 20, 11, 8, '100g', ['tương nén'], { 'cup': 1.6 }),
    createIng('lentils', 116, 9, 0.4, 20, '100g', ['đậu lăng'], { 'cup': 2.0 }),
    createIng('chickpeas', 164, 9, 2.6, 27, '100g', ['đậu gà'], { 'cup': 1.6, 'can': 4.0 }),
    createIng('black beans', 132, 9, 0.5, 24, '100g', ['đậu đen'], { 'cup': 1.7 }),

    // =================================================================
    // 4. SỮA & PHÔ MAI (DAIRY)
    // =================================================================
    createIng('milk', 42, 3.4, 1, 5, '100ml', ['sữa tươi'], { 'cup': 2.45, 'tbsp': 0.15 }),
    createIng('yogurt', 59, 10, 0.4, 3.6, '100g', ['sữa chua'], { 'cup': 2.45, 'pot': 1.25 }),
    createIng('butter', 717, 0.9, 81, 0.1, '100g', ['bơ lạt'], { 'stick': 1.13, 'tbsp': 0.14 }),
    createIng('cheddar cheese', 403, 25, 33, 1.3, '100g', ['phô mai cheddar'], { 'slice': 0.28, 'cup': 1.1 }),
    createIng('mozzarella', 280, 28, 17, 3.1, '100g', ['phô mai mozzarella'], { 'slice': 0.2, 'cup': 1.1 }),
    createIng('parmesan', 431, 38, 29, 4.1, '100g', ['phô mai parmesan'], { 'tbsp': 0.05 }),
    createIng('feta', 264, 14, 21, 4, '100g', ['phô mai feta'], { 'cup': 1.5, 'block': 2.0 }),
    createIng('cream cheese', 342, 6, 34, 4, '100g', ['phô mai kem'], { 'tbsp': 0.15 }),
    createIng('heavy cream', 340, 2.8, 36, 2.7, '100ml', ['kem tươi', 'whipping cream'], { 'cup': 2.4 }),
    createIng('sour cream', 193, 2.1, 19, 2.9, '100g', ['kem chua'], { 'tbsp': 0.15 }),
    createIng('coconut milk', 230, 2.3, 24, 6, '100ml', ['nước cốt dừa'], { 'cup': 2.4, 'can': 4.0 }),
    createIng('almond milk', 15, 0.5, 1.1, 0.3, '100ml', ['sữa hạnh nhân'], { 'cup': 2.4 }),

    // =================================================================
    // 5. TINH BỘT & NGŨ CỐC (GRAINS & PASTA)
    // =================================================================
    createIng('rice', 130, 2.7, 0.3, 28, '100g', ['gạo', 'cơm'], { 'cup': 1.95, 'bowl': 2.0 }),
    createIng('brown rice', 111, 2.6, 0.9, 23, '100g', ['gạo lứt'], { 'cup': 1.95 }),
    createIng('quinoa', 120, 4.4, 1.9, 21, '100g', ['hạt diêm mạch'], { 'cup': 1.85 }),
    createIng('oats', 389, 16.9, 6.9, 66, '100g', ['yến mạch'], { 'cup': 0.9 }),
    createIng('pasta', 131, 5, 1.1, 25, '100g', ['mỳ ý', 'nui'], { 'cup': 1.4 }),
    createIng('spaghetti', 371, 13, 1.5, 75, '100g', ['mỳ ý khô'], { 'serving': 0.8 }),
    createIng('noodles', 138, 4.5, 2.1, 25, '100g', ['mỳ', 'phở'], { 'serving': 1.0 }),
    createIng('bread', 265, 9, 3.2, 49, '100g', ['bánh mì'], { 'slice': 0.3, 'piece': 0.8 }),
    createIng('tortilla', 218, 6, 3, 45, '100g', ['vỏ bánh'], { 'piece': 0.3 }),
    createIng('flour', 364, 10, 1, 76, '100g', ['bột mì'], { 'cup': 1.25 }),

    // =================================================================
    // 6. GIA VỊ, SỐT & DẦU (PANTRY & CONDIMENTS)
    // =================================================================
    createIng('olive oil', 884, 0, 100, 0, '100ml', ['dầu oliu'], { 'tbsp': 0.14, 'tsp': 0.05 }),
    createIng('vegetable oil', 884, 0, 100, 0, '100ml', ['dầu thực vật'], { 'tbsp': 0.14 }),
    createIng('sesame oil', 884, 0, 100, 0, '100ml', ['dầu mè'], { 'tbsp': 0.14 }),
    createIng('soy sauce', 53, 6, 0, 5, '100ml', ['nước tương'], { 'tbsp': 0.16 }),
    createIng('fish sauce', 35, 5, 0, 3, '100ml', ['nước mắm'], { 'tbsp': 0.18 }),
    createIng('vinegar', 18, 0, 0, 0.1, '100ml', ['giấm'], { 'tbsp': 0.15 }),
    createIng('mayonnaise', 680, 1, 75, 1, '100g', ['sốt mayonnaise'], { 'tbsp': 0.14 }),
    createIng('ketchup', 101, 1, 0, 27, '100g', ['tương cà'], { 'tbsp': 0.15 }),
    createIng('mustard', 66, 4, 3, 6, '100g', ['mù tạt'], { 'tbsp': 0.15 }),
    createIng('honey', 304, 0.3, 0, 82, '100g', ['mật ong'], { 'tbsp': 0.21, 'cup': 3.4 }),
    createIng('sugar', 387, 0, 0, 100, '100g', ['đường'], { 'tbsp': 0.12, 'cup': 2.0 }),
    createIng('salt', 0, 0, 0, 0, '100g', ['muối'], { 'tsp': 0.06 }),
    createIng('black pepper', 251, 10, 3, 64, '100g', ['tiêu'], { 'tsp': 0.02 }),
    createIng('peanut butter', 588, 25, 50, 20, '100g', ['bơ đậu phộng'], { 'tbsp': 0.16 }),

    // =================================================================
    // 7. HẠT & CÁC LOẠI KHÁC (NUTS & OTHERS)
    // =================================================================
    createIng('almonds', 579, 21, 50, 22, '100g', ['hạnh nhân'], { 'cup': 1.4 }),
    createIng('walnuts', 654, 15, 65, 14, '100g', ['óc chó'], { 'cup': 1.2 }),
    createIng('peanuts', 567, 26, 49, 16, '100g', ['đậu phộng'], { 'cup': 1.46 }),
    createIng('chia seeds', 486, 17, 31, 42, '100g', ['hạt chia'], { 'tbsp': 0.1 }),
    createIng('chocolate chips', 479, 4, 28, 63, '100g', ['socola chip'], { 'cup': 1.7 }),
    createIng('cocoa powder', 228, 20, 14, 58, '100g', ['bột cacao'], { 'cup': 0.86 }),
    createIng('vanilla extract', 288, 0, 0, 13, '100ml', ['vani'], { 'tsp': 0.04 }),
    createIng('basil', 23, 3, 0.6, 2.7, '100g', ['húng quế'], { 'bunch': 0.5 }),
    createIng('parsley', 36, 3, 0.8, 6, '100g', ['ngò tây'], { 'bunch': 0.5 }),
    createIng('cilantro', 23, 2, 0.5, 3.7, '100g', ['ngò rí'], { 'bunch': 0.5 })
];

const seedIngredientNutrition = async () => {
    try {
        await connectDB();
        console.log('🔄 Bắt đầu nạp 150+ nguyên liệu (Upsert Mode)...');

        const operations = ingredientNutritionData.map(item => ({
            updateOne: {
                filter: { name: item.name },
                update: { $set: item },
                upsert: true
            }
        }));

        if (operations.length > 0) {
            const result = await IngredientNutrition.bulkWrite(operations);
            console.log(` Thành công!`);
            console.log(`   - Cập nhật/Thêm mới: ${result.upsertedCount + result.modifiedCount} nguyên liệu`);
        }

        console.log('Cơ sở dữ liệu dinh dưỡng đã sẵn sàng để tính toán!');
        process.exit(0);
    } catch (error) {
        console.error('Lỗi:', error);
        process.exit(1);
    }
};

seedIngredientNutrition();