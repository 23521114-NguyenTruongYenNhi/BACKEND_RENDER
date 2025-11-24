import express from 'express';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 * name: Auth
 * description: User authentication and registration endpoints
 */

/**
 * @swagger
 * /api/auth/signup:
 * post:
 * summary: Register a new user
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - name
 * - email
 * - password
 * properties:
 * name:
 * type: string
 * example: John Doe
 * email:
 * type: string
 * format: email
 * example: john@example.com
 * password:
 * type: string
 * format: password
 * example: Password123!
 * responses:
 * 201:
 * description: User registered successfully
 * 400:
 * description: User already exists or invalid input data
 */
router.post('/signup', signup);

/**
 * @swagger
 * /api/auth/login:
 * post:
 * summary: Authenticate user and get JWT token
 * tags: [Auth]
 * requestBody:
 * required: true
 * content:
 * application/json:
 * schema:
 * type: object
 * required:
 * - email
 * - password
 * properties:
 * email:
 * type: string
 * format: email
 * example: john@example.com
 * password:
 * type: string
 * format: password
 * example: Password123!
 * responses:
 * 200:
 * description: Login successful
 * content:
 * application/json:
 * schema:
 * type: object
 * properties:
 * token:
 * type: string
 * description: JWT Access Token
 * user:
 * type: object
 * description: User profile information
 * 401:
 * description: Invalid credentials
 */
router.post('/login', login);

export default router;