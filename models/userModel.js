const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      unique: true,
    },
    firstName: {
      type: String,
      default: "",
    },
    lastName: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    verification: {
      token: {
        type: String,
        default: "",
      },
      expireTime: {
        type: Date,
        default: null,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Static login method
userSchema.statics.login = async function (email, password) {
  // Validation
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  // Find an email within the database
  const user = await this.findOne({ email });

  // if no user exists then throw error

  if (!user) {
    throw Error("Incorrect Email, try signing up!");
  }

  // need to march the password with hash password
  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw Error("Incorrect login credentials");
  }

  return user;
};

// Static register method
userSchema.statics.register = async function (
  username,
  firstName,
  lastName,
  email,
  password,
  isAdmin
) {
  // Find an email within the database
  const exists = await this.findOne({ email });

  // Validation
  if (!email || !password) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password not strong enough");
  }

  // if it exists then throw error
  if (exists) {
    throw Error("Email already in use");
  }

  // SALT: attaches a random string at the end of the password to prevent hackers for password cracking
  // generate salt
  const salt = await bcrypt.genSalt(10);

  // create a has and attach password + hash
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    username,
    firstName,
    lastName,
    email,
    password: hash,
    isAdmin,
  });

  return user;
};

// Static verify method
userSchema.statics.verifyEmail = async function (query = {}) {
  const user = await this.findOne(query).lean().exec();
  if (user) {
    user.userId = user._id;
  }

  return user;
};

userSchema.statics.updateVerification = async function (_id, body) {
  const result = await this.findByIdAndUpdate(_id, body, { new: true }).exec();
  if (!result) {
    throw Error(
      "Sorry no such user found please refresh and try updating again!"
    );
  }
  return result;
};

module.exports = mongoose.model("User", userSchema);
