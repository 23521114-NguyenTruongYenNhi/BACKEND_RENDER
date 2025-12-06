import IngredientNutrition from '../models/IngredientNutrition.js';

/**
 * Helper: Chuẩn hóa đơn vị đầu vào về key chuẩn trong DB
 * Ví dụ: "grams" -> "g", "tsp." -> "tsp"
 */
const normalizeUnit = (inputUnit) => {
    if (!inputUnit) return '';
    const unit = inputUnit.toLowerCase().trim();

    // Mapping các biến thể về đơn vị chuẩn
    const unitMap = {
        // Khối lượng
        'gram': 'g', 'grams': 'g', 'gr': 'g', 'gms': 'g',
        'kilogram': 'kg', 'kilograms': 'kg', 'kilo': 'kg', 'kgs': 'kg',
        'ounce': 'oz', 'ounces': 'oz',
        'pound': 'lb', 'pounds': 'lb', 'lbs': 'lb',
        // Thể tích
        'milliliter': 'ml', 'milliliters': 'ml',
        'liter': 'l', 'liters': 'l',
        'tablespoon': 'tbsp', 'tablespoons': 'tbsp', 'tbs': 'tbsp',
        'teaspoon': 'tsp', 'teaspoons': 'tsp',
        'cup': 'cup', 'cups': 'cup',
        // Số lượng
        'piece': 'piece', 'pieces': 'piece', 'pc': 'piece', 'pcs': 'piece',
        'whole': 'piece', 'head': 'head', 'clove': 'clove', 'slice': 'slice',
        'stalk': 'stalk', 'stick': 'stick', 'fillet': 'fillet', 'can': 'can'
    };

    return unitMap[unit] || unit;
};

/**
 * Helper: Hàm tính toán cốt lõi
 * Đã thêm logic "Safety Net" để tránh lỗi trả về 0
 */
const performCalculation = (ingredient, quantity, unit) => {
    const qty = parseFloat(quantity);

    // 1. Validate số lượng
    if (isNaN(qty) || qty <= 0) {
        return { calories: 0, protein: 0, fat: 0, carbs: 0 };
    }

    // 2. Chuẩn hóa đơn vị
    const cleanUnit = normalizeUnit(unit);

    // 3. Lấy bảng quy đổi từ DB (Xử lý an toàn cho Mongoose Map)
    let conversions = {};
    if (ingredient.conversions) {
        if (typeof ingredient.conversions.get === 'function') {
            conversions = Object.fromEntries(ingredient.conversions);
        } else {
            conversions = ingredient.conversions;
        }
    }

    // 4. Tìm hệ số nhân (Factor)
    // Ưu tiên 1: Tìm chính xác trong conversions
    let factor = conversions[cleanUnit];

    // Ưu tiên 2: Tìm theo tên gốc (ví dụ input là 'grams')
    if (!factor) factor = conversions[unit.toLowerCase().trim()];

    // Ưu tiên 3: Tìm dạng số ít (bỏ 's' ở cuối)
    if (!factor) factor = conversions[cleanUnit.replace(/s$/, '')];

    // 5. --- LOGIC AN TOÀN (QUAN TRỌNG) ---
    // Nếu không tìm thấy trong DB, tự động tính các trường hợp cơ bản
    if (!factor) {
        const std = ingredient.standardUnit || '100g'; // Mặc định DB lưu là 100g

        // Trường hợp A: DB lưu chuẩn là 100g
        if (std === '100g') {
            if (cleanUnit === 'g') factor = 0.01;      // 1g = 0.01 của 100g
            else if (cleanUnit === 'kg') factor = 10;  // 1kg = 10 lần 100g
            else if (cleanUnit === 'oz') factor = 0.2835;
            else if (cleanUnit === 'lb') factor = 4.53;
        }
        // Trường hợp B: DB lưu chuẩn là 100ml
        else if (std === '100ml') {
            if (cleanUnit === 'ml') factor = 0.01;
            else if (cleanUnit === 'l') factor = 10;
        }

        // Trường hợp C: Đơn vị nhập vào trùng khớp hoàn toàn đơn vị chuẩn (ví dụ nhập "100g")
        if (cleanUnit === std) {
            factor = 1;
        }
    }

    // 6. Nếu vẫn không tìm được hệ số -> Log lỗi và trả về 0
    if (!factor) {
        console.log(`[WARN] Không tìm thấy cách đổi: ${qty} ${unit} -> ${ingredient.standardUnit} (${ingredient.name})`);
        return { calories: 0, protein: 0, fat: 0, carbs: 0 };
    }

    // 7. Tính toán
    const totalStandardUnits = qty * factor;

    // Log debug để bạn biết code đang chạy
    console.log(`[CALC] ${ingredient.name}: ${qty}${cleanUnit} (x${factor}) = ${totalStandardUnits * ingredient.caloriesPerUnit} cal`);

    return {
        calories: Math.round(ingredient.caloriesPerUnit * totalStandardUnits),
        protein: parseFloat((ingredient.proteinPerUnit * totalStandardUnits).toFixed(1)),
        fat: parseFloat((ingredient.fatPerUnit * totalStandardUnits).toFixed(1)),
        carbs: parseFloat((ingredient.carbsPerUnit * totalStandardUnits).toFixed(1))
    };
};

// --- API CONTROLLERS ---

// 1. Lấy tất cả nguyên liệu
export const getAllIngredientNutrition = async (req, res) => {
    try {
        const ingredients = await IngredientNutrition.find().sort({ name: 1 });
        res.json(ingredients);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 2. Lấy nguyên liệu theo tên
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

// 3. Tính toán cho 1 nguyên liệu (Single)
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

// 4. Tính toán cho cả công thức (Recipe/Multiple)
export const calculateRecipeNutrition = async (req, res) => {
    try {
        const { ingredients } = req.body;

        if (!ingredients || !Array.isArray(ingredients)) {
            return res.status(400).json({ message: 'Ingredients list is required and must be an array.' });
        }

        let totalNutrition = { calories: 0, protein: 0, fat: 0, carbs: 0 };
        const ingredientDetails = [];

        for (const ing of ingredients) {
            const { name, quantity, unit } = ing;

            if (!name || !quantity || !unit) {
                ingredientDetails.push({ ...ing, error: "Missing data" });
                continue;
            }

            const searchName = name.toLowerCase().trim();

            // --- 🔍 SMART SEARCH LOGIC (BẮT ĐẦU) ---

            // Bước 1: Tìm chính xác (tên hoặc alias)
            let ingredient = await IngredientNutrition.findOne({
                $or: [
                    { name: searchName },
                    { aliases: searchName }
                ]
            });

            // Bước 2: Nếu không thấy, thử THÊM 's' (ví dụ: nhập "egg" -> tìm "eggs")
            if (!ingredient) {
                ingredient = await IngredientNutrition.findOne({
                    $or: [
                        { name: searchName + 's' },
                        { aliases: searchName + 's' }
                    ]
                });
            }

            // Bước 3: Nếu vẫn không thấy và từ có 's', thử BỎ 's' (ví dụ: nhập "onions" -> tìm "onion")
            if (!ingredient && searchName.endsWith('s')) {
                const singularName = searchName.slice(0, -1);
                ingredient = await IngredientNutrition.findOne({
                    $or: [
                        { name: singularName },
                        { aliases: singularName }
                    ]
                });
            }
            // --- 🔍 SMART SEARCH LOGIC (KẾT THÚC) ---

            if (ingredient) {
                // Gọi hàm tính toán
                const nutrition = performCalculation(ingredient, quantity, unit);

                // Cộng dồn
                totalNutrition.calories += nutrition.calories;
                totalNutrition.protein += nutrition.protein;
                totalNutrition.fat += nutrition.fat;
                totalNutrition.carbs += nutrition.carbs;

                ingredientDetails.push({
                    name: ingredient.name, // Trả về tên chuẩn trong DB (ví dụ "eggs")
                    inputName: name,       // Tên người dùng nhập
                    quantity,
                    unit,
                    nutrition
                });
            } else {
                console.log(`[WARN] Not found in DB: ${searchName}`);
                ingredientDetails.push({
                    name: name,
                    quantity,
                    unit,
                    nutrition: { calories: 0, protein: 0, fat: 0, carbs: 0 },
                    notFound: true
                });
            }
        }

        // Làm tròn kết quả tổng
        totalNutrition.calories = Math.round(totalNutrition.calories);
        totalNutrition.protein = Math.round(totalNutrition.protein * 10) / 10;
        totalNutrition.fat = Math.round(totalNutrition.fat * 10) / 10;
        totalNutrition.carbs = Math.round(totalNutrition.carbs * 10) / 10;

        res.json({
            totalNutrition,
            ingredientDetails
        });

    } catch (error) {
        console.error("[ERROR] Recipe calculation error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// 5. Tạo mới nguyên liệu (Admin)
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