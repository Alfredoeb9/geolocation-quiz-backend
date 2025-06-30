const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const {
  log,
  checkRequiredParams,
  emailRegex,
  addTime,
  getCurrentDateTime,
  isDatePast,
} = require("../lib/utils/utils");
const User = require("../models/userModel");
const {
  sendVerifyingUserEmail,
  sendForgotPasswordEmail,
} = require("../lib/mailer");
const jwt = require("jsonwebtoken");

const createToken = async (_id, isAdmin) => {
  return jwt.sign({ _id, isAdmin: isAdmin }, process.env.JWT_SECRET);
};

const register = async (req, res, next) => {
  try {
    const { username, firstName, lastName, email, password, isAdmin } =
      req.body;

    const isValidEmail = await emailRegex(email);
    if (!isValidEmail) throw Error("Please provide a proper email");

    const newUser = await User.register(
      username,
      firstName,
      lastName,
      email,
      password,
      isAdmin
    );

    // create a token per user
    const token = await createToken(newUser._id);
    if (!token) {
      return res.status(400).json({ error: "Token could not be created" });
    }

    const link = `${process.env.REACT_APP_AUTH_BASE_URL}/verify-email/${token}`;
    const fullName = newUser.firstName + " " + newUser.lastName;

    await sendVerifyingUserEmail(newUser.email, fullName, link);

    // return the users info down below
    // return the verification message
    return res
      .status(200)
      .json({ email, token, msg: "Email verification sent...!" });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: "Please provide email and password" });
    }

    const user = await User.login(email, password);

    // create a token per user
    const token = await createToken(user._id, user._doc.isAdmin);

    const verification = {
      token: token,
      expireTime: addTime(1, getCurrentDateTime(), "hours"),
      isVerified: true,
    };

    const updatedUser = await User.updateVerification(
      { _id: user._id },
      { verification }
    );

    if (!updatedUser) {
      return res.status(400).json({ error: "User not found or not updated" });
    }

    const { password: _, isAdmin, ...otherDetails } = updatedUser._doc;

    // return the users info down below
    return res.status(200).json({ email, token, ...otherDetails, isAdmin });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(400).json({ error: error.message });
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const user = await User.verifyEmail({
      "verification.token": req.headers.authorization,
    });
    if (user && user.verification && user.verification.isVerified)
      // throw staticResponseMessageObject.emailAlreadyVerified;
      return res.status(400).json({ error: "Email is verified" });

    if (user && user.verification && user.verification.expireTime) {
      const isTokenValid = isDatePast(
        getCurrentDateTime(),
        user.verification.expireTime
      );
      if (!isTokenValid)
        return res.status(400).json({ error: "Toekn verification Expired" });
      // throw staticResponseMessageObject.verificationTokenExpired;
    }

    const verification = {
      token: req.headers.authorization,
      expireTime: addTime(1, getCurrentDateTime(), "hours"),
      isVerified: true,
    };
    const payload = await User.updateVerification(
      { _id: req.user.id },
      { verification }
    );
    if (!payload)
      return res.status(400).json({ error: "Verification Data Not Updated" });

    const { password, isAdmin, ...otherDetails } = payload._doc;

    return res.status(200).json({
      ...otherDetails,
      message: "User Authenicated",
    });
  } catch (error) {
    return res.status(400).json({ error: error });
  }
};

const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.verifyEmail({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: "new user found...!" });
    }
    if (user && user.verification && user.verification.isVerified)
      return res.status(400).json({ error: "Email is verified" });

    const token = await createToken(user._id);

    const link = `${process.env.REACT_APP_AUTH_BASE_URL}/verify-email/${token}`;
    const fullName = user.firstName + " " + user.lastName;
    await sendVerifyingUserEmail(user.email, fullName, link);

    return res.status(200).json({
      message: "Verification mail sent...!",
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Please provide an email!" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ error: "Email Not Registered!" });
    }

    const token = await createToken(user._id);
    const link = `${process.env.REACT_APP_AUTH_BASE_URL}/reset-password/${token}`;
    const fullName = user.firstName + " " + user.lastName;

    await sendForgotPasswordEmail(email, fullName, link);

    return res.status(200).json({ message: "Verification mail sent!" });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { truePassword } = req.body;
    const newId = req.user._id.toString();
    if (!truePassword) {
      return res.status(400).json({ error: "Please provide a password!" });
    }
    if (truePassword.length < 6) {
      return res
        .status(400)
        .json({ error: "Provide password with 6 characters or more!" });
    }

    if (!validator.isStrongPassword(truePassword)) {
      return res.status(400).json({ error: "Password not strong enough" });
    }

    let decodeUser = null;
    if (req.user) {
      decodeUser = newId;
    }
    const user = await User.findOne({ _id: decodeUser });
    if (!user) {
      return res.status(400).json({ error: "No such user found!" });
    }

    const salt = await bcrypt.genSalt(10);

    // create a has and attach password + hash
    const hash = await bcrypt.hash(truePassword, salt);

    const payload = await User.findByIdAndUpdate(
      { _id: decodeUser },
      { password: hash },
      { new: true }
    ).exec();
    if (!payload) {
      return res
        .status(400)
        .json({ error: "Password could not be updated please try again!" });
    }

    return res.status(200).json({ message: "Password was updated!" });
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

// update the user
const updateUser = async (req, res) => {
  const { firstName, lastName, email } = req.body;

  try {

    // fire up the login function from the userModel
    const newUpdatedUser = await User.findOneAndUpdate(
      { email: email },
      {
        firstName: firstName,
        lastName: lastName,
        email: email,
      },
      { new: true }
    );
    return res.status(201).json(newUpdatedUser);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
};

module.exports = {
  verifyEmail,
  resendVerificationEmail,
  register,
  login,
  updateUser,
  forgotPassword,
  resetPassword,
};
