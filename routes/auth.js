const express = require("express");
const router = express.Router();
//middlewares 
  const {requireSignin,isAdmin} = require("../middlewares/auth");
const { 
    register,
    login,
    updateProfile
      } = require("../controllers/auth");


router.post("/register",register);
router.post("/login",login);
router.get("/auth-check",requireSignin,(req,res)=>{
    res.json({ok:true});
})
router.get("/admin-check",requireSignin,isAdmin,(req,res)=>{
    res.json({ok:true})
})

router.post("/updateProfile",requireSignin,updateProfile);


module.exports = router;