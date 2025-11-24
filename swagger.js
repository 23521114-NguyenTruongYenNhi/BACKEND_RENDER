import swaggerAutogen from 'swagger-autogen';

const doc = {
    info: {
        title: 'Mystère Meal API',
        description: 'API Documentation automatically generated',
    },
    host: 'mystere-meal-api.onrender.com', 
    schemes: ['https', 'http'],
    securityDefinitions: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
        }
    }
};

const outputFile = './swagger-output.json';
const routes = [
    './routes/authRoutes.js',
    './routes/recipeRoutes.js',
    './routes/userRoutes.js',
    './routes/adminRoutes.js',
];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, routes, doc);