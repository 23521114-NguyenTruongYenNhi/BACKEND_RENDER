import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // 1. Tạo transporter với service 'gmail' (Tự động cấu hình cổng chuẩn nhất)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    // 2. Cấu hình nội dung email
    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    // 3. Gửi email
    try {
        const info = await transporter.sendMail(message);
        console.log("Email sent successfully via Gmail Service! MsgID:", info.messageId);
    } catch (error) {
        console.error("Email send failed:", error);
        // Không throw error để tránh làm crash server nếu gửi mail lỗi
    }
};

export default sendEmail;