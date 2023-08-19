const express = require("express");
const router = express.Router();
const postController = require('../controllers/postController')


router
    .route("/").post(postController.createPost)
//     .delete(userController.deleteUser)
//     .get(userController.getUser)

router
   .route("/:id").put(postController.updatePost)
   .delete(postController.deletePost)
   .get(postController.getPost)

router
    .route("/:id/likedis").put(postController.likeDislikePost)

router
    .route("/timeline/:userId").get(postController.getTimeline)
router
    .route("/profile/:username").get(postController.getUserAllPost)

module.exports = router