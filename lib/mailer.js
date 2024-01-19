const nodemailer = require("nodemailer");
const templateService = require("../services/templateService");
// const { SMTPConfig } = require("../bin/constant/setup");

const SMTPConfig = {
  service: "gmail",
  EMAIL: "alfredoeb96@gmail.com",
  PASSWORD: process.env.EMAIL_PWD, // Here Password is master key from smtp
  PORT: 587,
  FROM_EMAIL: "alfredoeb96@gmail.com",
};

const transporter = nodemailer.createTransport({
  secure: false,
  service: SMTPConfig.service,
  auth: {
    user: SMTPConfig.EMAIL,
    pass: SMTPConfig.PASSWORD,
  },
});

const sendEmail = async (mailOptions) => {
  transporter.verify(async (error) => {
    if (error) throw Error("Something went wrong");
  });
  const emailResponse = await transporter.sendMail(mailOptions);
  if (!emailResponse.messageId) return { error: "Sent Went Wrong" };
  return { result: "Email sent successfully" };
};

module.exports = {
  sendForgotPasswordEmail: async (toEmail, name, url) => {
    const content = `A unique link to reset your password has been generated for you. To reset your password, click the link below and follow the instructions.`;
    const title = "You have requested to reset your password";
    const button = "Reset Password";
    const subTxt = "This link will expire in 24 hours.";
    const mainLink = url;

    const html = templateService.getForgotTemplate({
      name,
      content,
      title,
      button,
      subTxt,
      mainLink,
    });

    const mailOptions = {
      from: SMTPConfig.FROM_EMAIL,
      to: toEmail,
      subject: "Reset Password Request",
      html,
    };

    const sendEmailResponse = await sendEmail(mailOptions);
    if (!sendEmailResponse) throw Error("Email Not Sent");

    return sendEmailResponse;
  },

  sendVerifyingUserEmail: async (toEmail, name, url) => {
    const content = `We're excited to have you get started. Please verify you email by clicking on the link below.`;
    const title = "Welcome!";
    const button = "Verify Email";
    const subTxt = "";
    const mainLink = url;

    const html = templateService.getForgotTemplate({
      name,
      content,
      title,
      button,
      subTxt,
      mainLink,
    });

    const mailOptions = {
      from: SMTPConfig.FROM_EMAIL,
      to: toEmail,
      subject: "Verify your email for Geolocation Quiz!",
      html,
    };

    const sendEmailResponse = await sendEmail(mailOptions);
    if (!sendEmailResponse) throw Error("Email Not Sent");

    return sendEmailResponse;
  },
};
