// File: server.js (Backend)
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://mystere-meal-frontend.vercel.app',
        'https://mystere-meal-frontend-ow6lbi1yv.vercel.app',
        /https:\/\/mystere-meal-frontend.*\.vercel\.app/
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Swagger Config ---
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Mystère Meal API',
        version: '1.0.0',
        description: 'RESTful API for Mystère Meal recipe recommendation system',
    },
    servers: [
        { url: 'https://mystere-meal-api.onrender.com/api' }, // Production
        { url: 'http://localhost:5000/api' }                 // Development
    ],
};
const options = { swaggerDefinition, apis: [] };
const swaggerDocs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- Routes ---
app.use('/api/recipes', recipeRoutes);
app.use('/api/users', authRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.json({ message: 'Mystère Meal API Server is running', status: 'OK' });
});

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'System is healthy' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});