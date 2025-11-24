import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import recipeRoutes from './routes/recipeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// --- CONFIG PATH FOR ESM MODULES ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- DEBUG: VERIFY ROUTE FILES ---
console.log("🔍 Current directory (__dirname):", __dirname);
const routesPath = path.join(__dirname, 'routes');
if (fs.existsSync(routesPath)) {
    console.log("✅ Routes directory found at:", routesPath);
    console.log("📄 Files in routes:", fs.readdirSync(routesPath));
} else {
    console.error("❌ ERROR: Routes directory NOT found at:", routesPath);
}

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Swagger Configuration ---
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Mystère Meal API',
            version: '1.0.0',
            description: 'API documentation for Mystère Meal recipe recommendation system',
        },
        servers: [
            {
                // Update this URL with your actual Render URL
                url: 'https://mystere-meal-api.onrender.com',
                description: 'Production Server',
            },
            {
                url: 'http://localhost:5000',
                description: 'Local Development',
            },
        ],
    },
    // CRITICAL FIX: Use path.join to create ABSOLUTE PATHS. 
    // Relative paths (./) often fail on Cloud environments.
    apis: [
        path.join(__dirname, 'routes/*.js'), // Scans all files in routes folder
        path.join(__dirname, 'server.js')    // Scans this file
    ],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Root Endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Mystère Meal API Server is running',
        status: 'OK',
        documentation: '/api-docs',
    });
});

// Health Check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'System is healthy' });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});