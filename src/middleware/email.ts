import nodemailer from "nodemailer";

export const sendResetEmail = async (to: string, code: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Lend It Out Support" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset Code",
    text: `Your password reset code is: ${code}`,
    html: `<p>Your password reset code is: <strong>${code}</strong></p>`,
  };

  await transporter.sendMail(mailOptions);
};
