const express = require("express");
const router = express.Router();
const authController = require('../controllers/authController')


router
    .route("/").post(authController.registerUser)

router
    .route("/login").post(authController.loginUser)
module.exports = router