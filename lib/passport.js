const jwt = require("jsonwebtoken");

module.exports = {
  verifyToken: async (token, SECRET, res) => {
    // console.log(token);
    // console.log(SECRET);
    if (!token) {
      return res.staus(401).json({ error: "You are not Authorized!" });
    }

    try {
      const payload = jwt.verify(token, SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Token is not valid!" });
        return user;
      });

      return payload;
    } catch (error) {
      return next(handleError(500, `${error}`));
    }
  },
};
