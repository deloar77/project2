const jwt = require("jsonwebtoken");
const User = require("../models/user");


exports.requireSignin=async(req,res,next)=>{
    try{
       const decoded = jwt.verify(req.headers.authorization,process.env.JWT_SECRET);
       req.user = decoded;
       next();

    }catch(err){
        return res.status(401).json(err);
    }
}

exports.isAdmin = async(req,res,next) =>{
    try{
        const user = await User.findById(req.user._id);
        if(user.roll !==1){
            return res.status(401).send("unauthorized");
        } else {
            next();
        }


    } catch(err){
        console.log(err);
    }
}