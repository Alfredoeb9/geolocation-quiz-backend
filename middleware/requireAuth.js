const jwt = require("jsonwebtoken");
const { verifyToken } = require("../lib/passport");
const User = require("../models/userModel");
// const { handleError } = require("../utils/errorHandler");

const requireAuth = async (req, res, next) => {
  // verify authentication
  // grab the auth from the headers
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
    // return next(handleError(401, "Authorization token required"));
  }

  // split the auth value and split on the space
  // let token = cookie.split("access_token=")[1];

  // check if token has been tampered with or not
  try {
    const { _id } = await verifyToken(
      authorization,
      process.env.JWT_SECRET,
      res
    );
    // console.log(_id);
    // find the user with the id that matches
    req.user = await User.findOne({ _id }).select("_id");
    // console.log("req.user", req.user);
    return next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ error: "Request is not Authorized!" });
    // next(handleError(401, "Request is not authorized"));
  }
};

const verifyUser = async (req, res, next) => {
  const { cookie } = req.headers;

  if (!cookie) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  // split the auth value and split on the space
  let token = cookie.split("access_token=")[1];

  try {
    const user = await verifyToken(token, process.env.JWT_SECRET, res);

    if (user._id == req.params.id || user.isAdmin) {
      return next();
    } else {
      if (err) return res.status(403).json({ error: err });
    }
  } catch (error) {
    return res.status(401).json({ error: "Request is not Authorized" });
    // return next(handleError(401, "Request is not authorized"));
  }
};

const verifyAdmin = async (req, res, next) => {
  const { cookie } = req.headers;

  if (!cookie) {
    return res.status(401).json({ error: "Authorization token required!" });
    // return next(handleError(401, "Authorization token required"));
  }

  // split the auth value and split on the space
  let token = cookie.split("access_token=")[1];

  try {
    const user = await verifyToken(token, process.env.JWT_SECRET, res);

    console.log(user);

    if (user.isAdmin) {
      return next();
    } else {
      if (err) return res.status(403).json({ error: err });
    }
  } catch (error) {
    return res.status(401).json({ error: "Authorization token required!" });
  }
};

// const requireAuth = async (req, res, next) => {
//   // verify authentication
//   // grab the auth from the headers
//   const { cookie } = req.headers;

//   if (!cookie) {
//     return next(handleError(401, "Authorization token required"));
//   }

//   // split the auth value and split on the space
//   let token = cookie.split("access_token=")[1];

//   // check if token has been tampered with or not
//   try {
//     const { _id } = verifyToken(token, process.env.JWT_SECRET, next);
//     // console.log(_id);
//     // find the user with the id that matches
//     req.user = await User.findOne({ _id }).select("_id");
//     // console.log("req.user", req.user);
//     next();
//   } catch (error) {
//     console.log(error);
//     next(handleError(401, "Request is not authorized"));
//   }
// };

module.exports = { requireAuth, verifyUser, verifyAdmin };
