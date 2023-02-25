const User = require("../models/userModel");
const { adminFrontendUrl } = require("../bin/constant/setup");
const { sendVerifyingUserEmail } = require("../lib/mailer");
const jwt = require("jsonwebtoken");

const createToken = (_id, isAdmin) => {
  return jwt.sign({ _id, isAdmin: isAdmin }, process.env.JWT_SECRET);
};

const register = async (req, res, next) => {
  try {
    const { username, firstName, lastName, email, password, isAdmin } =
      req.body;
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
    const token = createToken(newUser._id);

    const link = `${process.env.REACT_APP_AUTH_BASE_URL}/verify-email/${token}`;
    const fullName = newUser.firstName + " " + newUser.lastName;

    console.log("from register backend", newUser.email, fullName, link);

    await sendVerifyingUserEmail(newUser.email, fullName, link);

    // return the users info down below
    return res.status(200).json({ email, token });
    // await newUser.save();
    // res.status(201).send("User has been created");
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Refresh the page and please try signing up again!" });
  }
};

const login = async (req, res, next) => {
  console.log(req.body);
  const { email } = req.body;
  try {
    const user = await User.login(email, req.body.password);

    const { password, isAdmin, ...otherDetails } = user._doc;

    // create a token per user
    const token = createToken(user._id, isAdmin);

    // return the users info down below
    return res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json({ email, token, ...otherDetails });
    // await newUser.save();
    // res.status(201).send("User has been created");
  } catch (error) {
    return res
      .status(400)
      .json({ error: "Please provide correct credentials" });
  }
};

module.exports = {
  register,
  login,
};
