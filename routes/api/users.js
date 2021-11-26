const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");
var ObjectId = require('mongodb').ObjectID;
// Load input validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");
const Auction = require("../../models/Auction");

// @route POST api/users/register
// @desc Register user
// @access Public
router.post("/register", (req, res) => {
  // Form validation

  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      // Hash password before saving in database
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      return res.status(404).json({ emailnotfound: "Email not found" });
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {

        const payload = {
          id: user.id,
          name: user.name
        };

        // Sign token
        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 31556926 // 1 year in seconds
          },
          (err, token) => {
            res.json({
              user:user._id,
              success: true,
              token: "Bearer " + token
            });
          }
        );
        req.session.userId = user._id;
      } else {
        return res
          .status(400)
          .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

router.post("/logout", (req, res) => {
  if (req.session) {
    console.log(req.session);
    req.session.destroy(function(err) {
        return res.redirect('/');
    });
  }
});

router.post("/auction", (req, res) => {
      const newAuction = new Auction({
        name: req.body.name,
        type: req.body.type,
        initialvalue: req.body.initialvalue,
        finalvalue: req.body.finalvalue
      });
      newAuction
            .save()
            .then(auction => res.json(auction))
            .catch(err => console.log(err));
});

router.get("/auctions", (req, res) => {
  var auctionData = Auction.find({}).then(data =>{
    console.log(data)
    return res.status(200).json(data);
  });
  //console.log(auctionData);
});

router.delete("/auction", (req, res) => {
  const _id = new ObjectId(req.body.id);
  console.log(req.body);
  var auctionData = Auction.deleteOne({_id:_id}).then(data =>{
    return res.status(200).json(data);
  });
});
module.exports = router;
