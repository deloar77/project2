const Category = require("../models/category");
const slugify = require("slugify");


exports.create = async(req,res)=>{
    try{
        const {name}= req.body;
        if(!name.trim()){
            return res.json({error:"the name is required"})
        }
        const existingCategory = await Category.findOne({name});
        if(existingCategory){
            return res.json({error:"the category already exists"})
        }
        const category = await new Category({name,slug:slugify(name)}).save();
        res.json(category);

    } catch(err){
        console.log(err);
        return res.status(400).json(err);
    }
}

exports.update = async(req,res)=>{
    try{

        const {name} = req.body;
        const {categoryId} = req.params;
        const category = await Category.findByIdAndUpdate(
            categoryId,
            {
                name,
                slug:slugify(name),
            },
            {new:true}
        );
        res.json(category);


    } catch(err){
        console.log(err);
        return res.status(400).json(err.message);
    }
}

exports.remove = async(req,res)=>{
    try{
        const removed = await Category.findByIdAndDelete(req.params.categoryId);
        res.json(removed);

    }catch (err){
        console.log(err);
        return res.status(400).json(err.message);
    }
}
exports.list=async(req,res)=>{
    try {
        const all = await Category.find({});
        res.json(all)
        
    } catch (error) {
        console.log(error);
        return res.status(400).json(error.message)
        
    }
}

exports.read = async(req,res)=>{
    try {
        const category = await Category.findOne({slug:req.params.slug});
        res.json(category);
        
    } catch (err) {
        console.log(err);
        res.status(400).json(err.message);
        
    }
}

