const jwt = require("jsonwebtoken");
const User = require("../models/models");

const generateToken = (id , role) =>{
        return jwt.sign({id , role} , process.env.JWT_SECRET , {expiresIn : "7d"});
}

exports.registor = async (req , res) =>{
        try {
        const {name ,email , password ,year ,  department } = req.body;
        const find = await User.findOne({email});
        if(find) {
         return res.status(400).json({success : false , message : "The Email is Already Existed"});
        }}

        const user = await User.create({name ,email , password ,year ,  department}) ; 
        res.status(201).json({
                success : true ,
                Data : {
                        id : user._id ,
                        name : user.name . 
                        email : user.email ,
                        token : generateToken( _id . user._id );
                }
        });
        
}