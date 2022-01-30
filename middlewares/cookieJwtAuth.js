const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.cookieJwtAuth = (req, res, next) => {
  console.log("Validating token..");
  const token = req.cookies.token;
  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = user;
    console.log("Token is valid!");
    next();
  } catch (err) {
    res.clearCookie("token");
    res.send(err);
  }
};

exports.isAdmin = (req, res, next) => {
  const token = req.cookies.token;
  try {
    const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (user.isAdmin) next();
    else console.log("Rejected - this user is not an admin");
  } catch (err) {
    res.clearCookie("token");
    res.send(err);
  }
};
