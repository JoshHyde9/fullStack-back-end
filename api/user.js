const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../Models/User");

router.get("/", (req, res) => {
  res.json({
    user: req.user
  });
});

router.post("/register", (req, res) => {
  const { firstName, lastName, email, password, password2 } = req.body;

  if (!firstName || !lastName || !email || !password || !password2) {
    return res.json({ error: "Please fill in all fields." });
  }

  if (password != password2) {
    return res.json({ error: "Passwords do not match." });
  }

  if (password.length < 6) {
    return res.json({ error: "Password must be at least 6 characters long." });
  }

  User.findOne({ email: email })
    .then(user => {
      if (user) {
        return res.json({ error: "Email is already in use." });
      } else {
        const newUser = new User({
          firstName,
          lastName,
          email,
          password
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;

            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                res.json({ success: "Account created successfully." });
              })
              .catch(err => {
                console.error(err);
              });
          });

          if (err) console.error(err);
        });
      }
    })
    .catch(err => {
      console.error(err);
    });
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ error: "Please fill in all fields." });
  }

  User.findOne({ email: email })
    .then(user => {
      if (!user) {
        return res.json({ error: "Invalid credentials." });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;
        else if (isMatch) {
          const payload = {
            id: user._id,
            email: user.email
          };
          jwt.sign(
            payload,
            process.env.ACCESS_TOKEN,
            {
              expiresIn: "1d"
            },
            (err, token) => {
              if (err) {
                return res
                  .status(422)
                  .json({ error: "Server error, please try again." });
              } else {
                return res.json({ success: "Logged in successfully.", token });
              }
            }
          );
        } else {
          return res.json({ error: "Invalid credentials." });
        }
      });
    })
    .catch(error => {
      return res.json({ error: "Server error, please try again." });
    });
});

module.exports = router;
