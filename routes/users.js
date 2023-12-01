const express = require("express");
const router = express.Router();

const dotenv = require("dotenv");
dotenv.config();

const { checkUser, createUser } = require("../controllers/auth-controller");

router.post("/signin", checkUser);
router.post("/signup", createUser);

module.exports = router;
