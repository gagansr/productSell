const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/keys");
const signupModel = require("../models/signup.model");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    console.log("Auth : ", authorization);

    return res.status(400).json({ error: "You must be logged in" });
  }

  const token = authorization.replace("Bearer ", "");

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if (err) {
      return res.status(404).json({ error: "You must be logged in" });
    }
    console.log("payload : ", payload);

    const _id = payload._id;
    signupModel.findById(_id).then((userData) => {
      req.user = userData;
      next();
    });
  });
};
