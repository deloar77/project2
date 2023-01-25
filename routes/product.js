const express = require("express");
const router = express.Router();
const formidable = require("express-formidable");
const { requireSignin,isAdmin } = require("../middlewares/auth");

const {
    create,
     list,
    read,
    photo,
    
} = require("../controllers/product");

router.post("/product",requireSignin,isAdmin,formidable(),create);
router.get("/products",list);
router.get("/product/:slug",read);
router.get("/product/photo/:productId", photo);





module.exports= router;
