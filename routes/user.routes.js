import express from 'express';
const router = express.Router();
import { body, validationResult } from 'express-validator';
import userModel from '../models/user.model.js';
import fileModel from '../models/file.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import requireAuth from '../middleware/auth.middleware.js';

const uploadFolder = path.join(process.cwd(), 'uploads');
fs.mkdirSync(uploadFolder, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadFolder);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 30 * 1024 * 1024 }
});

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

const existingUser = await userModel.findOne({
    $or: [{ email }, { username }]
});

if(existingUser){
return res.status(409).send("Email or username already exists");
}

const hashedPassword = await bcrypt.hash(password,10);

await userModel.create({
email,
username,
password:hashedPassword
});

res.redirect('/user/login');

}catch(err){
console.error('register error', err);
res.status(500).json({ message: 'Error creating user', error: err.message });
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
userId:user._id.toString(),
email:user.email,
username:user.username
},
process.env.JWT_SECRET
);
res.cookie('token',token,{ httpOnly: true, sameSite: 'lax' });

res.redirect('/user/home');

}catch(err){
console.error('login error', err);
res.status(500).json({ message: 'Login error', error: err.message });
}

}
);

router.get('/home', requireAuth, async (req, res) => {
try {
const files = await fileModel.find({ user: req.user.userId }).sort({ createdAt: -1 });
res.render('home', { files, username: req.user.username });
} catch (err) {
console.log(err);
res.status(500).send('Error loading home page');
}
});

router.post('/home', requireAuth, upload.single('files'), async (req, res) => {
try {
if (!req.file) {
return res.status(400).send('Please select a file');
}

await fileModel.create({
user: req.user.userId,
originalName: req.file.originalname,
storedName: req.file.filename,
filePath: req.file.path,
mimeType: req.file.mimetype,
size: req.file.size
});

res.redirect('/user/home');
} catch (err) {
console.log(err);
res.status(500).send('File upload failed');
}
});

router.get('/files/:id/download', requireAuth, async (req, res) => {
try {
const file = await fileModel.findOne({
_id: req.params.id,
user: req.user.userId
});

if (!file) {
return res.status(404).send('File not found');
}

res.download(path.resolve(file.filePath), file.originalName);
} catch (err) {
console.log(err);
res.status(500).send('Download failed');
}
});

router.post('/logout', (req, res) => {
res.clearCookie('token');
res.redirect('/user/login');
});

export default router;