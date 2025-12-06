import nodemailer from 'nodemailer'; // Đổi từ require sang import

const sendEmail = async (options) => {
    // 1. Khởi tạo Transporter
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
        // Fix lỗi Render
        tls: {
            rejectUnauthorized: false,
        },
        family: 4,
        connectionTimeout: 10000,
        greetingTimeout: 5000,
    });

    // 2. Cấu hình nội dung email
    const mailOptions = {
        from: `"Mystère Meal Support" <${process.env.EMAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
    };

    // 3. Gửi mail
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
        return info;
    } catch (error) {
        console.error("Lỗi chi tiết khi gửi mail:", error);
        throw new Error("Email could not be sent");
    }
};

export default sendEmail; // Đổi từ module.exports sang export default