import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

// Nạp biến môi trường từ file .env
dotenv.config();

const sendTestEmail = async () => {
    console.log("--- BẮT ĐẦU TEST EMAIL ---");
    console.log("1. Đang đọc cấu hình từ .env...");
    console.log("- User:", process.env.SMTP_EMAIL);
    // Chỉ hiện 3 ký tự đầu của pass để bảo mật
    console.log("- Pass:", process.env.SMTP_PASSWORD ? process.env.SMTP_PASSWORD.substring(0, 3) + "..." : "KHÔNG TÌM THẤY PASSWORD");

    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        console.error("❌ LỖI: Chưa đọc được file .env hoặc thiếu thông tin.");
        return;
    }

    console.log("2. Đang kết nối tới Gmail...");
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    try {
        console.log("3. Đang gửi email thử nghiệm...");
        let info = await transporter.sendMail({
            from: `"Test Mail" <${process.env.SMTP_EMAIL}>`,
            to: process.env.SMTP_EMAIL, // Gửi cho chính mình để test
            subject: "Test Email Node.js ✔",
            text: "Nếu bạn nhận được email này thì cấu hình đã THÀNH CÔNG!",
        });

        console.log("✅ THÀNH CÔNG RỒI! Email đã được gửi.");
        console.log("Message ID:", info.messageId);
    } catch (error) {
        console.error("❌ THẤT BẠI: Gửi mail bị lỗi.");
        console.error("Chi tiết lỗi:", error.message);

        if (error.message.includes("Username and Password not accepted")) {
            console.log("👉 GỢI Ý: Mật khẩu App Password bị sai hoặc chưa bật.");
        }
    }
};

sendTestEmail();