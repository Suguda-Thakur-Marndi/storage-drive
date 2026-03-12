import express from 'express';
const router = express.Router();
import { body, validationResult } from 'express-validator';
import userModel from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

router.get('/register',(req,res)=>{
    res.render('register');
});
router.post('/register',

body('email').trim().isEmail().withMessage("Enter valid email"),
body('password').isLength({min:5}).withMessage("Password must be at least 5 characters"),
body('username').notEmpty().withMessage("Username required").isLength({min:3}),

async(req,res)=>{

const errors = validationResult(req);

if(!errors.isEmpty()){
return res.status(400).json({errors:errors.array()});
}

const {email,username,password} = req.body;

try{

const hashedPassword = await bcrypt.hash(password,10);

const user = await userModel.create({
email,
username,
password:hashedPassword
});

res.send("User Registered Successfully");

}catch(err){
console.log(err);
res.status(500).send("Error creating user");
}

}
);
router.get('/login',(req,res)=>{
res.render('login');
});

router.post('/login',

body('email').trim().isEmail().withMessage("Enter valid email"),
body('password').notEmpty().withMessage("Password required"),

async(req,res)=>{

const errors = validationResult(req);

if(!errors.isEmpty()){
return res.status(400).json({errors:errors.array()});
}

const {email,password} = req.body;

try{

const user = await userModel.findOne({email});

if(!user){
return res.status(401).send("Invalid Email or Password");
}

const isMatch = await bcrypt.compare(password,user.password);

if(!isMatch){
return res.status(401).send("Invalid Email or Password");
}

const token = jwt.sign(
{
userId:user._id,
email:user.email,
username:user.username
},
process.env.JWT_SECRET
);
res.cookie('token',token);

res.json({
message:"Login successful",
token
});

}catch(err){
console.log(err);
res.status(500).send("Login error");
}

}
);

export default router;