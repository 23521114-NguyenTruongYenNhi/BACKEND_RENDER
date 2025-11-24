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

// --- CONFIG PATH FOR ESM MODULES ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- SWAGGER DOCUMENTATION (FULL MANUAL DEFINITION) ---
// This manual definition ensures stability across all deployment environments (Render/Linux)
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Mystère Meal API',
        version: '1.0.0',
        description: 'RESTful API for Mystère Meal recipe recommendation system',
        contact: {
            name: 'Mystère Meal Team',
            email: 'support@mysteremeal.com'
        },
        license: {
            name: 'MIT',
            url: 'https://opensource.org/licenses/MIT'
        }
    },
    servers: [
        {
            url: 'https://mystere-meal-api.onrender.com/api', // Replace with your actual Render URL
            description: 'Production server'
        },
        {
            url: 'http://localhost:5000/api',
            description: 'Development server'
        }
    ],
    tags: [
        {
            name: 'Authentication',
            description: 'User registration and login operations'
        },
        {
            name: 'Recipes',
            description: 'Recipe management operations'
        },
        {
            name: 'User Profile',
            description: 'User profile and favorites management'
        },
        {
            name: 'Admin',
            description: 'Administrative operations (requires admin role)'
        }
    ],
    paths: {
        // --- AUTHENTICATION ---
        '/users/signup': {
            post: {
                tags: ['Authentication'],
                summary: 'Register a new user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['name', 'email', 'password'],
                                properties: {
                                    name: { type: 'string', example: 'John Doe' },
                                    email: { type: 'string', format: 'email', example: 'user@example.com' },
                                    password: { type: 'string', minLength: 6, example: 'password123' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: 'User registered successfully' },
                    400: { description: 'Email already exists or validation error' }
                }
            }
        },
        '/users/login': {
            post: {
                tags: ['Authentication'],
                summary: 'Login user',
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['email', 'password'],
                                properties: {
                                    email: { type: 'string', format: 'email', example: 'user@example.com' },
                                    password: { type: 'string', example: 'password123' }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Login successful (Returns Token)' },
                    401: { description: 'Invalid email or password' }
                }
            }
        },
        // --- RECIPES ---
        '/recipes': {
            get: {
                tags: ['Recipes'],
                summary: 'Get all recipes',
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } }
                ],
                responses: {
                    200: {
                        description: 'List of recipes',
                        content: {
                            'application/json': {
                                schema: { type: 'array', items: { $ref: '#/components/schemas/Recipe' } }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['Recipes'],
                summary: 'Create a new recipe (requires authentication)',
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: { $ref: '#/components/schemas/RecipeInput' }
                        }
                    }
                },
                responses: {
                    201: { description: 'Recipe created successfully' },
                    401: { description: 'Unauthorized' }
                }
            }
        },
        '/recipes/search': {
            get: {
                tags: ['Recipes'],
                summary: 'Search recipes by ingredients and filters',
                parameters: [
                    { name: 'ingredients', in: 'query', description: 'Comma-separated ingredients', schema: { type: 'string', example: 'chicken,tomato' } },
                    { name: 'cuisine', in: 'query', schema: { type: 'string', example: 'Italian' } },
                    { name: 'mealType', in: 'query', schema: { type: 'string', enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'] } },
                    { name: 'difficulty', in: 'query', schema: { type: 'string', enum: ['Easy', 'Medium', 'Hard'] } },
                    { name: 'maxTime', in: 'query', schema: { type: 'integer', example: 60 } },
                    { name: 'isVegetarian', in: 'query', schema: { type: 'boolean' } },
                    { name: 'isVegan', in: 'query', schema: { type: 'boolean' } },
                    { name: 'isGlutenFree', in: 'query', schema: { type: 'boolean' } }
                ],
                responses: {
                    200: {
                        description: 'Search results',
                        content: {
                            'application/json': {
                                schema: { type: 'array', items: { $ref: '#/components/schemas/Recipe' } }
                            }
                        }
                    }
                }
            }
        },
        '/recipes/{id}': {
            get: {
                tags: ['Recipes'],
                summary: 'Get recipe details by ID',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: {
                        description: 'Recipe details',
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/Recipe' } }
                        }
                    },
                    404: { description: 'Recipe not found' }
                }
            },
            put: {
                tags: ['Recipes'],
                summary: 'Update recipe (requires authentication, owner only)',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': { schema: { $ref: '#/components/schemas/RecipeInput' } }
                    }
                },
                responses: {
                    200: { description: 'Recipe updated successfully' },
                    403: { description: 'Not authorized to update this recipe' }
                }
            },
            delete: {
                tags: ['Recipes'],
                summary: 'Delete recipe (requires authentication, owner only)',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Recipe deleted successfully' },
                    403: { description: 'Not authorized to delete this recipe' }
                }
            }
        },
        '/recipes/{id}/comments': {
            post: {
                tags: ['Recipes'],
                summary: 'Add comment and rating (requires authentication)',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['text', 'rating'],
                                properties: {
                                    text: { type: 'string', example: 'Delicious recipe!' },
                                    rating: { type: 'integer', minimum: 1, maximum: 5, example: 5 }
                                }
                            }
                        }
                    }
                },
                responses: {
                    201: { description: 'Comment added successfully' },
                    401: { description: 'Unauthorized' }
                }
            }
        },
        // --- USER PROFILE ---
        '/users/{id}': {
            get: {
                tags: ['User Profile'],
                summary: 'Get user profile details',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: {
                        description: 'User profile data',
                        content: {
                            'application/json': { schema: { $ref: '#/components/schemas/User' } }
                        }
                    },
                    404: { description: 'User not found' }
                }
            }
        },
        '/users/{id}/favorites': {
            get: {
                tags: ['User Profile'],
                summary: 'Get user favorite recipes',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: {
                        description: 'List of favorite recipes',
                        content: {
                            'application/json': {
                                schema: { type: 'array', items: { $ref: '#/components/schemas/Recipe' } }
                            }
                        }
                    }
                }
            },
            post: {
                tags: ['User Profile'],
                summary: 'Toggle favorite recipe (Add/Remove)',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['recipeId'],
                                properties: { recipeId: { type: 'string' } }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: 'Favorite status updated successfully' }
                }
            }
        },
        '/users/{id}/recipes': {
            get: {
                tags: ['User Profile'],
                summary: 'Get recipes created by a specific user',
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: {
                        description: 'List of created recipes',
                        content: {
                            'application/json': {
                                schema: { type: 'array', items: { $ref: '#/components/schemas/Recipe' } }
                            }
                        }
                    }
                }
            }
        },
        // --- ADMIN ---
        '/admin/recipes': {
            get: {
                tags: ['Admin'],
                summary: 'Get all recipes filtered by status (requires admin)',
                security: [{ BearerAuth: [] }],
                parameters: [
                    { name: 'status', in: 'query', schema: { type: 'string', enum: ['pending', 'approved', 'rejected'], default: 'pending' } }
                ],
                responses: {
                    200: { description: 'List of recipes' },
                    403: { description: 'Admin access required' }
                }
            }
        },
        '/admin/recipes/{id}/approve': {
            post: {
                tags: ['Admin'],
                summary: 'Approve a recipe (requires admin)',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Recipe approved successfully' }
                }
            }
        },
        '/admin/recipes/{id}/reject': {
            post: {
                tags: ['Admin'],
                summary: 'Reject a recipe (requires admin)',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Recipe rejected successfully' }
                }
            }
        },
        '/admin/recipes/{id}': {
            delete: {
                tags: ['Admin'],
                summary: 'Delete a recipe (requires admin)',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'Recipe deleted successfully' }
                }
            }
        },
        '/admin/users': {
            get: {
                tags: ['Admin'],
                summary: 'Get list of all users (requires admin)',
                security: [{ BearerAuth: [] }],
                responses: {
                    200: {
                        description: 'List of users',
                        content: {
                            'application/json': {
                                schema: { type: 'array', items: { $ref: '#/components/schemas/User' } }
                            }
                        }
                    }
                }
            }
        },
        '/admin/users/{id}/lock': {
            post: {
                tags: ['Admin'],
                summary: 'Lock user account (requires admin)',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'User account locked successfully' }
                }
            }
        },
        '/admin/users/{id}/unlock': {
            post: {
                tags: ['Admin'],
                summary: 'Unlock user account (requires admin)',
                security: [{ BearerAuth: [] }],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
                responses: {
                    200: { description: 'User account unlocked successfully' }
                }
            }
        }
    },
    components: {
        securitySchemes: {
            BearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            }
        },
        schemas: {
            User: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: "6923210c62b5be2e63b1d447" },
                    name: { type: 'string', example: "Demo Chef" },
                    email: { type: 'string', format: 'email', example: "demo@mysteremeal.com" },
                    // password: { type: 'string' }, // Usually not returned in public profile for security
                    isAdmin: { type: 'boolean', example: false },
                    isLocked: { type: 'boolean', example: false },
                    favorites: {
                        type: 'array',
                        items: { type: 'string', example: "6923210c62b5be2e63b1d449" }
                    },
                    createdRecipes: {
                        type: 'array',
                        items: { type: 'string', example: "6923210c62b5be2e63b1d449" }
                    },
                    createdAt: { type: 'string', format: 'date-time', example: "2025-11-23T14:58:20.163+00:00" },
                    updatedAt: { type: 'string', format: 'date-time', example: "2025-11-23T14:58:20.548+00:00" },
                    __v: { type: 'integer', example: 1 }
                }
            },
            Recipe: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: "6923210c62b5be2e63b1d449" },
                    title: { type: 'string', example: "Classic Margherita Pizza" },
                    // description: { type: 'string' }, // Not in your example data but good to have in schema if added later
                    image: { type: 'string', example: "/assets/pizza-margherita.jpg" },
                    cuisine: { type: 'string', example: "Italian" },
                    mealType: { type: 'string', example: "Dinner" },
                    difficulty: { type: 'string', example: "Medium" },
                    time: { type: 'integer', example: 45 },
                    rating: { type: 'number', example: 4.8 },
                    status: { type: 'string', enum: ['pending', 'approved', 'rejected'], example: "pending" },
                    ingredients: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ["flour", "tomato", "mozzarella", "basil", "olive oil", "yeast", "salt"]
                    },
                    steps: {
                        type: 'array',
                        items: { type: 'string' },
                        example: [
                            "Prepare pizza dough and let it rise for 1 hour",
                            "Roll out the dough into a circular shape"
                        ]
                    },
                    tags: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ["Italian", "Pizza", "Dinner"]
                    },
                    nutrition: {
                        type: 'object',
                        properties: {
                            calories: { type: 'number', example: 285 },
                            protein: { type: 'number', example: 12 },
                            fat: { type: 'number', example: 10 },
                            carbs: { type: 'number', example: 38 }
                        }
                    },
                    isVegetarian: { type: 'boolean', example: true },
                    isVegan: { type: 'boolean', example: false },
                    isGlutenFree: { type: 'boolean', example: false },
                    author: { type: 'string', example: "6923210c62b5be2e63b1d447" },
                    comments: { type: 'array', items: { type: 'string' }, example: [] },
                    createdAt: { type: 'string', format: 'date-time', example: "2025-11-23T14:58:20.459+00:00" },
                    updatedAt: { type: 'string', format: 'date-time', example: "2025-11-23T14:58:20.459+00:00" },
                    __v: { type: 'integer', example: 0 }
                }
            },
            RecipeInput: {
                type: 'object',
                required: ['title', 'cuisine', 'mealType', 'difficulty', 'time', 'ingredients', 'steps'],
                properties: {
                    title: { type: 'string', example: 'Creamy Pasta' },
                    description: { type: 'string', example: 'Delicious Italian pasta' },
                    image: { type: 'string', example: 'https://example.com/pasta.jpg' },
                    cuisine: { type: 'string', example: 'Italian' },
                    mealType: { type: 'string', enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'], example: 'Dinner' },
                    difficulty: { type: 'string', enum: ['Easy', 'Medium', 'Hard'], example: 'Medium' },
                    time: { type: 'integer', example: 30 },
                    servings: { type: 'integer', example: 2 },
                    ingredients: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['Pasta', 'Cream', 'Cheese']
                    },
                    steps: {
                        type: 'array',
                        items: { type: 'string' },
                        example: ['Boil water', 'Cook pasta', 'Mix sauce']
                    },
                    tags: { type: 'array', items: { type: 'string' }, example: ['pasta', 'quick'] },
                    isVegetarian: { type: 'boolean', example: true },
                    isVegan: { type: 'boolean', example: false },
                    isGlutenFree: { type: 'boolean', example: false },
                    nutrition: {
                        type: 'object',
                        properties: {
                            calories: { type: 'number', example: 500 },
                            protein: { type: 'number', example: 15 },
                            fat: { type: 'number', example: 20 },
                            carbs: { type: 'number', example: 60 }
                        }
                    }
                }
            },
            Comment: {
                type: 'object',
                properties: {
                    _id: { type: 'string' },
                    user: { type: 'string' },
                    recipe: { type: 'string' },
                    text: { type: 'string' },
                    rating: { type: 'integer' },
                    createdAt: { type: 'string', format: 'date-time' }
                }
            }
        }
    }
};

const options = {
    swaggerDefinition,
    apis: [], // Manual definition used, no file scanning needed
};

const swaggerDocs = swaggerJsdoc(options);
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