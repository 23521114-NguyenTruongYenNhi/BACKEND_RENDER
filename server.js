import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import connectDB from './config/db.js';
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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load Swagger documentation
const swaggerDocument = JSON.parse(
  readFileSync(join(__dirname, 'docs', 'swagger.json'), 'utf8')
);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Mystère Meal API Docs'
}));

// Routes
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
    endpoints: {
      health: '/health',
      apiDocs: '/api-docs',
      recipes: '/api/recipes',
      auth: '/api/users/signup, /api/users/login',
      admin: '/api/admin',
      ingredientNutrition: '/api/ingredients/nutrition',
      shoppingList: '/api/shopping-list'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Mystère Meal API is running', timestamp: new Date().toISOString() });
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
