const User = require("../models/user");
const {hashPassword,comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
require("dotenv").config();




exports.register = async(req,res)=>{
  try{
    // destructure name, email from req.body
    const {name,email,password} = req.body;

    //2. all fields require validation
    if(!name.trim()){
      return res.json({error:"Name is required"})
    }

    if(!email){
      return res.json({error:"email is required"})
    }
    if(!password || password.length<6){
      return res.json({error:"password must be atleast 6 character long"})
    }
    //3 check if email is taken

    const extinguisher = await User.findOne({email});
    if (extinguisher){
      return res.json({error:"email is already taken"})
    }

    //hash a password
    const hashedPassword = await hashPassword(password)
    //5 register a user
    const user  = await new User({
      name,
      email,
      password:hashedPassword,

    }).save();

    // create a signed jsonwebtoken
    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"})
    // send response 
    res.json({
      user:{
        name:user.name,
      email:user.email,
      roll:user.role,
      address:user.address
      },
      token
    })





  } catch(err){
    console.log(err);
  }


}
