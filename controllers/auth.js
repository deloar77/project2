const User = require("../models/user");
const {hashPassword,comparePassword } = require("../helpers/auth");
const jwt = require("jsonwebtoken");
const { findByIdAndUpdate } = require("../models/user");
require("dotenv").config();




exports.register = async(req,res)=>{
  try{
    // destructure name, email from req.body
    const {name,email,password,roll,address} = req.body;

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
    const hashedPassword = await hashPassword(password);
    //5 register a user
    const user  = await new User({
      name,
      email,
      password:hashedPassword,
      roll

    }).save();

    // create a signed jsonwebtoken
    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
    // send response 
    res.json({
      user:{
        name:user.name,
      email:user.email,
      roll:user.roll,
      address:user.address
      },
      token
    })

  } catch(err){
    console.log(err);
  }


}

exports.login = async(req,res)=>{
  try{
    //destructure name, email,password from req.body
    const {email,password} = req.body;

    // all field require validation
    if(!email){
      return res.json({error:"fill in with email"});
    }
    if(!password || password.length<6){
      return res.json({error:"please fill in with password"});
    }
    //3 check if user already exists
    const user = await User.findOne({email});
    if(!user){
      return res.json({error:"user is not found"})
    }
    
    // compare password
    const match = await comparePassword (password, user.password);
    if (!match){
      return res.json({error:"wrong password"})
    }
    // create signed jsonwebtoken
    const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{expiresIn:"7d"});
    // send token
    res.json({
      user:{
        name:user.name,
        email:user.email,
        roll:user.roll,
        address:user.address,
      },
      token,
    })

  } catch(err){
    console.log(err);
  }



}

exports.updateProfile = async(req,res)=>{
  try{
    const {name,password,address} = req.body;
    const user = await User.findById(req.user._id);
    // check password and its length
    if(password && password.length<6){
      return res.json({error:"password should be of 6 character"});

    }
    // hash the password
    const hashedPassword = password ? await hashPassword(password): undefined;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      {
        name:name || user.name,
        password:hashedPassword || user.password,
        address:address || user.address
      },
      {new:true}
    );
    updated.password = undefined;
    res.json(updated)
  }catch(err){
    console.log(err);
  }
}


