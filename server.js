// File: server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Configs
import connectDB from './config/db.js';

// Routes
import recipeRoutes from './routes/recipeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import ingredientNutritionRoutes from './routes/ingredientNutritionRoutes.js';
import shoppingListRoutes from './routes/shoppingListRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// --- Middleware ---

// CORS Configuration
app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://mystere-meal-frontend.vercel.app',
        'https://mystere-meal-frontend-ow6lbi1yv.vercel.app',
        /https:\/\/mystere-meal-frontend.*\.vercel\.app/,
        'https://frontend-final-gamma.vercel.app',
        'https://frontend-final-deploy-delta.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Swagger Documentation ---
try {
    const swaggerDocument = JSON.parse(
        readFileSync(join(__dirname, 'docs', 'swagger.json'), 'utf8')
    );

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
        customCss: '.swagger-ui .topbar { display: none }',
        customSiteTitle: 'Mystère Meal API Docs'
    }));
} catch (error) {
    console.log("Warning: swagger.json not found or invalid. Docs might not work.");
}

// --- Routes ---
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/ingredients/nutrition', ingredientNutritionRoutes);
app.use('/api/shopping-list', shoppingListRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Mystère Meal API Server',
        version: '1.0.0',
        status: 'OK',
        endpoints: {
            health: '/health',
            apiDocs: '/api-docs',
            recipes: '/api/recipes',
            shoppingList: '/api/shopping-list'
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'System is healthy' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});