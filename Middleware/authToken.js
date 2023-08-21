const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require('../models/user');
  const users = model.users


exports.protect = async (req, res, next) => {
  try {
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(404).json({
        message: "token not found ",
        data: null,
      });
    }
    
    // token verifintg
    const decoded = await promisify(jwt.verify)(token, process.env.ACESS_TOKEN_SECERT);
    // console.log("decoded.user",decoded.user)
    const currentUser = await users.findByPk(decoded.user.userId);
    if (!currentUser){
      return res.status(404).json({
        message: "invalid token",
        data: null,
      });
    }
    req.user = currentUser.dataValues;
    next();
    
  } catch (error) {
    console.log(error);
    return  res.status(403).json({
      message: "token expired",
      data: error.message,
    });
  }
};
