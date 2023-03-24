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
const { adminFrontendUrl } = require("../bin/constant/setup");
const {
  sendVerifyingUserEmail,
  sendForgotPasswordEmail,
} = require("../lib/mailer");
const jwt = require("jsonwebtoken");
const { relativeTimeRounding } = require("moment");

const createToken = async (_id, isAdmin) => {
  return jwt.sign({ _id, isAdmin: isAdmin }, process.env.JWT_SECRET);
};

const register = async (req, res, next) => {
  try {
    const { username, firstName, lastName, email, password, isAdmin } =
      req.body;

    const isValidEmail = await emailRegex(email);
    if (!isValidEmail) throw Error("Please provide a proper email");
    // console.log(req);
    const newUser = await User.register(
      username,
      firstName,
      lastName,
      email,
      password,
      isAdmin
    );
    // console.log(newUser);

    // create a token per user
    const token = await createToken(newUser._id);

    // console.log(token);

    // token.then((data) => console.log(data));

    const link = `${process.env.REACT_APP_AUTH_BASE_URL}/verify-email/${token}`;
    const fullName = newUser.firstName + " " + newUser.lastName;

    // console.log("from register backend", newUser.email, fullName, link);

    await sendVerifyingUserEmail(newUser.email, fullName, link);

    // return the users info down below
    // return the verification message
    return res
      .status(200)
      .json({ email, token, msg: "Email verification sent...!" });
    // await newUser.save();
    // res.status(201).send("User has been created");
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

const login = async (req, res, next) => {
  // console.log(req.body);
  const { email } = req.body;
  try {
    const user = await User.login(email, req.body.password);

    // console.log("we have a user", user);

    // const { password, isAdmin, ...otherDetails } = user._doc;

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

    const { password, isAdmin, ...otherDetails } = updatedUser._doc;

    // token: { accessToken: verification.token }, _id: updatedUser._id, email: updatedUser.email, type: updatedUser.type, aiCredits: updatedUser.aiCredits, firstName: updatedUser.firstName, lastName: updatedUser.lastName, country: updatedUser.country }

    // return the users info down below
    return res.status(200).json({ email, token, ...otherDetails, isAdmin });
    // await newUser.save();
    // res.status(201).send("User has been created");
  } catch (error) {
    res.status(500).json({ error: error.message });
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
        res.status(400).json({ error: "Toekn verification Expired" });
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
      res.status(400).json({ error: "Verification Data Not Updated" });

    const { password, isAdmin, ...otherDetails } = payload._doc;
    // if (!payload) throw staticResponseMessageObject.verificationDataNotUpdated;

    return res.status(200).json({
      ...otherDetails,
      message: "User Authenicated",
    });
  } catch (error) {
    //log(error)
    return res.status(400).json({ error: error });
    // console.log("From verify email:: ", error);
    // return next(Boom.notAcceptable(error.message).output.payload);
  }
};

const resendVerificationEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    // const fields = ['email']
    // await checkRequiredParams(fields, { email })

    const user = await User.verifyEmail({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: "new user found...!" });
      // return next(
      //   Boom.notFound((await responseMessageObject("User", null)).notFoundError)
      // );
    }
    if (user && user.verification && user.verification.isVerified)
      return res.status(400).json({ error: "Email is verified" });
    // throw staticResponseMessageObject.emailAlreadyVerified;

    const token = await createToken(user._id);

    const link = `${process.env.REACT_APP_AUTH_BASE_URL}/verify-email/${token}`;
    const fullName = user.firstName + " " + user.lastName;
    await sendVerifyingUserEmail(user.email, fullName, link);

    // const { password, isAdmin, ...otherDetails } = payload._doc;
    // if (!payload) throw staticResponseMessageObject.verificationDataNotUpdated;

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
  // const { id } = req.query;
  const { firstName, lastName, email } = req.body;

  // console.log(req.params);

  try {
    // if (id) {
    // const body = req.body;

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

    // if (!newUpdatedUser) {
    //   return res.status(400).json({ error: "No email "})
    // }

    return res.status(201).json(newUpdatedUser);
    // } else {
    //   return res.status(401).send({ error: "User Not Found" });
    // }
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
