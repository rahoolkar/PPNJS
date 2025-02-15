const express = require("express");
const router = express.Router();
const User = require("../models/users");
const wrapAsync = require("../utils/wrapAsync");
const {getSignupPage,postSignup} = require("../controllers/signup");

//get signup page route
router.get("/",getSignupPage);

router.post("/",wrapAsync(postSignup));

module.exports = router;