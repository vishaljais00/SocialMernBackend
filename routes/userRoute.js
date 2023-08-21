const express = require("express");
const router = express.Router();
const userController = require('../controllers/userController')


router
    .route("/:id").put(userController.userUpdate)
    .delete(userController.deleteUser)
    .get(userController.getUser)

router
    .route("/").get(userController.getUser)

router
    .route("/friend/:userId").get(userController.getFriends)

router
    .route("/:id/follow").put(userController.followUser)
router
    .route("/:id/unfollow").put(userController.unfollowUser)

router
    .route("/:id/status").post(userController.UserAFriend)

module.exports = router