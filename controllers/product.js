const Product = require("../models/product");
const Category = ("../models/category.js")
const fs = require("fs");
const slugify = require("slugify");


exports.create = async(req,res)=>{
    try {
       // console.log(req.fields)
        const {name,description,price,category,quantity,shipping}= req.fields;
        const {photo} = req.files;
        

        // validation
        switch(true){
        case !name.trim():
        return res.json({error:"name is required"});
        case !description.trim():
        return res.json({error:"description is required"});
        case !price.trim():
        return res.json({error:"the price is required"});
        case !category.trim():
        return res.json({error:"category is required"});
        case !quantity.trim():
        return res.json({error:"the quantity is required"});
        case !shipping.trim():
        return res.json({error:"the shipping is required"});
        case photo && photo.size> 1000000:
        return res.json({error:"the image should be less than 1 mb in size"})   
        }

        // create product
        const product = new Product({...req.fields,slug:slugify(name)});
        if(photo){
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType= photo.type;
            
        }
         await product.save();
            res.json(product);

        
    } catch (err) {
        console.log(err);
      return  res.status(400).json(err.message)
        
    }
}

exports.list = async(req,res)=>{
    try {
        const products = await Product.find({})
        .populate("category")
        .select("-photo")
        .limit(2)
        .sort({createdAt:-1});
        res.json(products);
    } catch (err) {
        console.log(err);
        
    }
}

exports.read =async(req,res)=>{
    try {
        const product = await Product.findOne({slug:req.params.slug})
        .select("photo")
        .populate("categoty");
        res.json(product)
    } catch (err) {
        console.log(err);
        
    }
}

exports.photo = async (req,res)=>{
    try {
       const product = await Product.findById(req.params.productId).select("photo");
       if(product.photo.data){
        res.set("Content-Type",product.photo.contentType);
        return res.send(product.photo.data);
       }
        
    } catch (err) {
        console.log(err);
        
    }

}