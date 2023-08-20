const Post = require("../models/post")
const {Responce} = require('../helper/sendResponce');
const { findById } = require("../models/user");
const User = require("../models/user");
const { userImageUpload } = require("../helper/imageExport");

// create a post
exports.createPost = async(req, res) => {
    try {

            const uploadedData = await userImageUpload(req, res)
            if(uploadedData.status !== 200) return await Responce(res, 400 , 'something went wrong',uploadedData.message)
            let updatedData = req.body
            updatedData.img = uploadedData.imageName
            const newPost = new Post(updatedData)
            const savePost = await newPost.save();
            return await Responce(res, 200 , 'post created successfully',savePost)

    } catch (error) {
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}

//update a post 
exports.updatePost = async(req, res) => {
    try {
            const post = await Post.findById(req.params.id);
            if(post.userId === req.body.userId ){
                await post.updateOne({$set: req.body});
                return await Responce(res, 200 , 'post updated')
            }else{
                return await Responce(res, 403 , 'can update only your post')
            }
    } catch (error) {
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}

// delete a post
exports.deletePost = async(req, res) => {
    try {
            const post = await Post.findById(req.params.id);
            if(post.userId === req.body.userId ){
                await post.deleteOne();
                return await Responce(res, 200 , 'post deleted')
            }else{
                return await Responce(res, 403 , 'can update only your post')
            }
    } catch (error) {
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}


// like & dislike a post
exports.likeDislikePost = async(req, res) => {
    try {
            const post = await Post.findById(req.params.id);
            if(!post.likes.includes(req.body.userId) ){
                await post.updateOne({$push:{
                    likes: req.body.userId
                }});
                return await Responce(res, 200 , 'post has been liked')
            }else{
                await post.updateOne({$pull:{
                    likes: req.body.userId
                }});
                return await Responce(res, 200 , 'post has been disliked')
            }
    } catch (error) {
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}

// get a post

exports.getPost = async(req, res) => {
    try {
            const post = await Post.findById(req.params.id);
            return await Responce(res, 200 , 'post', post)
    } catch (error) {
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}

// get timeline of user
exports.getTimeline = async(req, res) => {
    try {
            // const currUser = await User.findById(req.params.userId)
            // const userPost = await Post.find({userId: currUser._id})
            // const friendPost = await Promise.all(
            //     currUser.followers.map(friendId => {
            //         return Post.find({userId: friendId})
                  
            //     })
            // )
            const currUser = await User.findById(req.params.userId);
            const userPost = await Post.find({ userId: currUser._id }).sort({ createdAt: -1 });
            const friendPostPromises = currUser.followers.map(async friendId => {
                const friendPosts = await Post.find({ userId: friendId });
                return friendPosts;
            });
            const friendPosts = await Promise.all(friendPostPromises);
            const flattenedFriendPosts = friendPosts.flat().sort((a, b) => b.createdAt - a.createdAt);
    
            return await Responce(res, 200 , 'timeline post', userPost.concat(...flattenedFriendPosts))
    } catch (error) {
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}

// get users all post 
exports.getUserAllPost = async(req, res) => {
    try {
            const user = await User.findOne({username: req.params.username})
            const userPost = await Post.find({userId: user._id}).sort({ createdAt: -1 });
            return await Responce(res, 200 , 'user posts', userPost)
    } catch (error) {
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}