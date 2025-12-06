import User from '../models/User.js'; // Kiểm tra lại đường dẫn model User của bạn
// Nếu có file ErrorResponse hoặc asyncHandler thì import vào, ở đây tôi viết try-catch cơ bản cho an toàn

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Tạo user (Mongoose sẽ tự hash password nếu trong Model bạn đã cấu hình pre-save hook)
        const user = await User.create({
            name,
            email,
            password,
        });

        // 2. Trả về Token luôn (Không gửi mail nữa)
        sendTokenResponse(user, 200, res);

    } catch (err) {
        // Xử lý lỗi trùng email (Duplicate key error code: 11000)
        if (err.code === 11000) {
            return res.status(400).json({ success: false, error: 'Email đã tồn tại' });
        }
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, error: 'Vui lòng nhập email và mật khẩu' });
        }

        // 2. Check for user (cần lấy cả password để so sánh)
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, error: 'Thông tin đăng nhập không đúng' });
        }

        // 3. Check if password matches
        // (Giả định trong Model User bạn có phương thức matchPassword)
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Thông tin đăng nhập không đúng' });
        }

        // 4. Trả về token
        sendTokenResponse(user, 200, res);

    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// @desc    Get current Logged in user
// @route   POST /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user,
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// --- Helper Function: Get token from model, create cookie and send response ---
const sendTokenResponse = (user, statusCode, res) => {
    // Gọi method getSignedJwtToken từ User Model
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    };

    // Nếu chạy trên production (Render) thì bật secure để dùng https
    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            // Có thể trả thêm info user cơ bản để Frontend dùng luôn
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
};