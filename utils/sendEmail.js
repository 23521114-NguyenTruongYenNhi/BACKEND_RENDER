const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    // 1. Khởi tạo Transporter
    const transporter = nodemailer.createTransport({
        // Sử dụng service 'gmail' tự động cấu hình host là smtp.gmail.com
        service: "gmail",

        // Cấu hình Port và Bảo mật (Quan trọng cho Render)
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true cho port 465, false cho các port khác

        // Thông tin xác thực
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS, // Đây phải là App Password (Mật khẩu ứng dụng)
        },

        // --- CẤU HÌNH FIX LỖI TIMEOUT TRÊN RENDER ---
        tls: {
            rejectUnauthorized: false, // Bỏ qua lỗi SSL (nếu có)
        },
        family: 4, // QUAN TRỌNG: Ép buộc dùng IPv4 để tránh lỗi timeout IPv6 trên Cloud
        connectionTimeout: 10000, // Timeout kết nối: 10 giây
        greetingTimeout: 5000,    // Timeout chờ phản hồi từ server mail: 5 giây
        // ---------------------------------------------
    });

    // 2. Cấu hình nội dung email
    const mailOptions = {
        from: `"Mystère Meal Support" <${process.env.EMAIL_USER}>`, // Tên người gửi
        to: options.email, // Email người nhận
        subject: options.subject, // Tiêu đề
        text: options.message, // Nội dung dạng text
        html: options.html, // Nội dung dạng HTML (nếu có)
    };

    // 3. Gửi mail
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Lỗi chi tiết khi gửi mail:", error);
        throw new Error("Email could not be sent"); // Ném lỗi ra để Controller bắt được
    }
};

module.exports = sendEmail;