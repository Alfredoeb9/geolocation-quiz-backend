const User = require("../models/userModel");

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
    return res.status(401).send({ error: error.message });
  }
};

// GET ALL USERS
const getUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};

// GET ONE USER
const getOneUser = async (req, res, next) => {
  try {
    const hotel = await User.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (error) {
    next(error);
  }
};

// DELETE USER
const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ msg: "User has been deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  getOneUser,
  updateUser,
  deleteUser,
};
