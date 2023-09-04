const User = require("../models/user")
const bcrypt = require('bcrypt')
const {Responce} = require('../helper/sendResponce')
const jwt = require("jsonwebtoken");


exports.registerUser = async(req, res)=>{
    try {   

        // generate new password 
        const {username, email, password } = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword =  await bcrypt.hash(password, salt)

        // create new user
        const user = new User({
            username,
            email,
            password : hashedPassword,
        })

        // save user & return responce
        const newUser = await user.save()
        return await Responce(res, 200 , 'user created successfully', newUser)
    } catch (error) {
        console.log(error);
        return await Responce(res, 400 , 'something went wrong', error)
    }
}

//Login

exports.loginUser = async(req, res)=>{
    try {
        const {email , password} = req.body
        const user = await User.findOne({email})
        if(!user) return res.status(404).send("user not found")
        const validPassword = await bcrypt.compare(password , user.password)
        if (!validPassword) return await Responce(res, 404 , 'user not found')
        const acesstoken = jwt.sign(
            {     
                user:{
                    ...user._doc
                }
            },
            process.env.ACESS_TOKEN_SECERT,
            { expiresIn: "8h" }
          );

        return await Responce(res, 200 , 'user login successfully', {user, acesstoken})

    } catch (error) {
        console.log(error);
        return await Responce(res, 400 , 'something went wrong', error)
    }
}