const express = require("express");
const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const router = express.Router();
const User = require("../models/signup.model");

const { JWT_SECRET } = require("../config/keys");
const requireLoggedIn = require("../middleware/requireLoggedIn");

router.route("/mkdir").get(requireLoggedIn, (req, res) => {
  res.json("This is protected");
});

router.route("/signin").post((req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ error: "plz fill all require fields" });
  }

  User.findOne({ email: email })
    .then((existUser) => {
      if (!existUser) {
        return res
          .status(404)
          .json({ error: "User Not Found..plz Signup first.." });
      }
      console.log(existUser);

      bcryptjs
        .compare(password, existUser.password)
        .then((doMatch) => {
          if (!doMatch) {
            return res
              .status(400)
              .json({ error: "Invalid email or password !" });
          } else {
            const token = jwt.sign({ _id: existUser._id }, JWT_SECRET);
            const { _id, name, email } = existUser;
            res.json({
              message: "Successfully Signedin!!",
              token: token,
              user: { _id, name, email },
            });
            return res
              .status(400)
              .json({ success: " Successfully Signed in :)" });
          }
        })
        .catch((err) => res.json({ error: err }));
    })
    .catch((err) => res.json({ error: err }));
});

router.route("/signup").post((req, res) => {
  const { name, email, password } = req.body;
  console.log(name, email, password);

  if (!name || !email || !password) {
    return res.json({ error: "plz fill all mandatory fileds.." });
  }

  bcryptjs.hash(password, 12).then((hashedPassword) => {
    User.findOne({ email: email })
      .then((existUser) => {
        if (existUser) {
          return res.json({ error: "User Already Exists (:" });
        }

        const user = User({
          name,
          email,
          password: hashedPassword,
        });
        user
          .save()
          .then((user) => {
            res.json("Signup Successfull..plz login for further.."),
              console.log(user);
          })
          .catch((err) => res.json({ error: err }));
      })
      .catch((err) => res.json({ error: err }));
  });
});

module.exports = router;
