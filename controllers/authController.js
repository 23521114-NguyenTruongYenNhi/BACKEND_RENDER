import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js'; // Đảm bảo bạn đã có file này

// Generate JWT Token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'your-secret-key', {
        expiresIn: '30d',
    });
};

// @desc    Register new user
// @route   POST /api/users/signup
// @access  Public
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            // --- BẮT ĐẦU ĐOẠN CODE GỬI EMAIL ---
            console.log("1. Đã tạo user thành công, bắt đầu gửi mail..."); // Log kiểm tra

            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Welcome to Mystere Meal',
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                            <h2 style="color: #ea580c;">Welcome ${user.name}!</h2>
                            <p>Thank you for registering with Mystere Meal.</p>
                            <p>Your account has been successfully created. You can now log in and start exploring recipes.</p>
                            
                            <div style="margin-top: 20px;">
                                <p><strong>Your Account Email:</strong> ${user.email}</p>
                            </div>

                            <div style="margin-top: 30px;">
                                <a href="${process.env.CLIENT_URL || 'https://frontend-final-deploy-delta.vercel.app'}" 
                                   style="background-color: #ea580c; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                                   Visit Website
                                </a>
                            </div>
                        </div>
                    `
                });
                console.log("2. Đã gửi email thành công!"); // Nếu thấy dòng này là mail đã đi
            } catch (emailError) {
                console.error("3. LỖI GỬI EMAIL:", emailError); // Nếu thấy dòng này, hãy chụp ảnh lỗi gửi mình
            }
            // --- KẾT THÚC ĐOẠN CODE GỬI EMAIL ---

            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                isLocked: user.isLocked,
                token: generateToken(user._id),
            });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                isLocked: user.isLocked,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};