import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import recipeRoutes from './routes/recipeRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// --- CONFIGURATION FOR ESM MODULES ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- SWAGGER CONFIGURATION ---
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Mystère Meal API',
            version: '1.0.0',
            description: 'RESTful API documentation for Mystère Meal recipe recommendation system',
            contact: {
                name: 'Developer Support',
                email: 'support@mysteremeal.com',
            },
        },
        servers: [
            {
                url: 'https://mystere-meal-api.onrender.com', // Update with your actual Render URL
                description: 'Production Server',
            },
            {
                url: 'http://localhost:5000',
                description: 'Local Development',
            },
        ],
        // JWT Authentication Configuration
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    // Explicitly list route files with absolute paths for Render compatibility
    apis: [
        path.join(__dirname, 'routes/authRoutes.js'),
        path.join(__dirname, 'routes/recipeRoutes.js'),
        path.join(__dirname, 'routes/userRoutes.js'),
        path.join(__dirname, 'routes/adminRoutes.js'),
    ],
};

// Initialize Swagger Docs
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- ROUTES ---
app.use('/api/recipes', recipeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Root Endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Mystère Meal API Server is operational',
        status: 'OK',
        documentation: '/api-docs',
    });
});

// Health Check Endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    console.log(`Documentation available at http://localhost:${PORT}/api-docs`);
});