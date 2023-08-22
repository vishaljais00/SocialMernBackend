const express = require("express");
const router = express.Router();
const messageController = require('../controllers/messageController')


router
    .route("/").post(messageController.newMessage)
    
router
    .route("/:conversation").get(messageController.getMessage)

    
module.exports = router