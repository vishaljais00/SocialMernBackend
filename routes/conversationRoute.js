const express = require("express");
const router = express.Router();
const conversationController = require('../controllers/conversationController')


router
    .route("/").post(conversationController.newConv)

router
    .route("/:userId").get(conversationController.getConv)


    
module.exports = router