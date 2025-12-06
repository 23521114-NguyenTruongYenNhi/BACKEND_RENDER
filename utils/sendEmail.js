import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // Debug log để xem cấu hình
    console.log("=== DEBUG EMAIL CONFIG ===");
    console.log("SMTP_EMAIL:", process.env.SMTP_EMAIL);

    // CÁCH FIX MỚI: Dùng service: 'gmail' thay vì host/port thủ công
    // Cách này giúp Nodemailer tự động xử lý các vấn đề về cổng và timeout
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const message = {
        from: `${process.env.SMTP_FROM_NAME} <${process.env.SMTP_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html: options.html,
    };

    const info = await transporter.sendMail(message);
    console.log("Message sent: %s", info.messageId);
};

export default sendEmail;