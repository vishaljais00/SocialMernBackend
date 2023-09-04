const User = require('../models/user');
const {Responce} = require('../helper/sendResponce')
const bcrypt = require('bcrypt')

// update user

exports.userUpdate = async(req, res) => {
    try {
            //if(req.body.userID === req.params.id || req.user.isAdmin){
            if(req.body.userID === req.params.id || req.body.isAdmin){
                if(req.body.password){
                        const salt = await bcrypt.genSalt(10)
                        const hashedPassword =  await bcrypt.hash(req.body.password, salt)
                        req.body.password = hashedPassword
                }
                const user = await User.findByIdAndUpdate(req.params.id, 
                    {$set: req.body}
                )
                return await Responce(res, 200 , 'account has been updated', user)
            }else{
                return await Responce(res, 403 , 'you can update only your account')
            }
    } catch (error) {   
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}

// delete user

exports.deleteUser = async(req, res) => {
    try {
            //if(req.body.userID === req.params.id || req.user.isAdmin){
            if(req.body.userID === req.params.id || req.body.isAdmin){
                const user = await User.findByIdAndDelete(req.params.id)
                return await Responce(res, 200 , 'account has been deleted sucessfully', user)
            }else{
                return await Responce(res, 403 , 'you can delete only your account')
            }
    } catch (error) {   
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}


// get a user

exports.getUser = async(req, res) => {
    try {
            const userId = req.query.userId 
            const username = req.query.username
            const user = userId ? await User.findById(userId) : await User.findOne({username})
            const {password, updatedAt, ...other} = user._doc
            return await Responce(res, 200 , 'user acoount', other)
    } catch (error) {   
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}

// get firend list

exports.getFriends = async(req, res) => {
    try {
            
            const user = await User.findById(req.params.userId)         
            const friends = await Promise.all(
                user.following?.map(friendId => {
                    return User.findById(friendId)
                })

            )
            let friendList = [];
            friends.map(friend=>{
                const {_id, username, profilePicture} = friend
                friendList.push({_id, username, profilePicture})
            })
            return await Responce(res, 200 , 'friend List', friendList)
    } catch (error) {   
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}

//follow a user

exports.followUser = async(req, res) => {
    try {
        if(req.body.userID !== req.params.id ){
            const user = await User.findById(req.params.id) 
            const currUser = await User.findById(req.body.userID)
            if(!user.followers.includes(req.body.userID)){
                await user.updateOne({$push:{
                    followers: req.body.userID
                }})
                await currUser.updateOne({$push:{
                    following : req.params.id
                }})
                return await Responce(res, 200 , 'user has been followed')
            }else{
                return await Responce(res, 403 , 'you already follow this account')
            }
        }else{
            return await Responce(res, 403 , 'cant follow your self')
        }
          
    } catch (error) {   
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}


// unfollow a user

exports.unfollowUser = async(req, res) => {
    try {
        if(req.body.userID !== req.params.id ){
            const user = await User.findById(req.params.id)
            const currUser = await User.findById(req.body.userID)
            if(user.followers.includes(req.body.userID)){
                await user.updateOne({$pull:{
                    followers: req.body.userID
                }})
                await currUser.updateOne({$pull:{
                    following : req.params.id
                }})
                return await Responce(res, 200 , 'user has been un followed')
            }else{
                return await Responce(res, 403 , 'you dont followed this account')
            }
        }else{
            return await Responce(res, 403 , 'cant follow and unfollow your self')
        }
          
    } catch (error) {   
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}

exports.UserAFriend = async(req, res) => {
    try {
       
            const user = await User.findOne({_id:req.body.userID, following: req.params.id})
            return await Responce(res, 200 , 'follow status', user)
          
    } catch (error) {   
        console.log(error)
        return await Responce(res, 500 , 'something went wrong',error)
    }
}


