import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
    // --- THÊM ĐOẠN LOG NÀY ĐỂ DEBUG TRÊN RENDER ---
    console.log("=== DEBUG EMAIL CONFIG ===");
    console.log("HOST:", process.env.SMTP_HOST || "KHÔNG CÓ (UNDEFINED) -> Lỗi là ở đây!");
    console.log("USER:", process.env.SMTP_EMAIL || "KHÔNG CÓ");
    console.log("PASS:", process.env.SMTP_PASSWORD ? "Đã có pass" : "KHÔNG CÓ PASS");
    // ----------------------------------------------

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
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

    await transporter.sendMail(message);
};

export default sendEmail;