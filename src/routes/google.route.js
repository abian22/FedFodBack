const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

router.get(
  "/",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    const token = jwt.sign({ userId: req.user.id }, process.env.SECRET);

    res.send({ token: token });

    res.redirect("/user/me");
  }
);

module.exports = router;
