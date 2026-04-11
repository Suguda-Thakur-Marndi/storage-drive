import express from 'express';
const router = express.Router();
import { body, validationResult } from 'express-validator';
import userModel from '../models/user.model.js';
import fileModel from '../models/file.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import requireAuth from '../middleware/auth.middleware.js';
import supabase from '../config/supabase.js';

const storageBucket = process.env.SUPABASE_STORAGE_BUCKET || 'user-files';

const storage = multer.memoryStorage();

const upload = multer({
    storage,
    limits: { fileSize: 30 * 1024 * 1024 }
});

const uploadAnyField = upload.fields([
    { name: 'file', maxCount: 1 },
    { name: 'files', maxCount: 1 }
]);

const getUploadedFile = (req) => {
    const fromFile = req.files?.file?.[0];
    const fromFiles = req.files?.files?.[0];
    return fromFile || fromFiles || null;
};

const sanitizeFileName = (name) => name.replace(/[^a-zA-Z0-9._-]/g, '-');

const getStoragePath = (userId, originalName) => {
    return `${userId}/${Date.now()}-${sanitizeFileName(originalName)}`;
};

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

router.post('/home', requireAuth, uploadAnyField, async (req, res) => {
try {
const uploadedFile = getUploadedFile(req);

if (!uploadedFile) {
return res.status(400).send('Please select a file');
}

const storagePath = getStoragePath(req.user.userId, uploadedFile.originalname);

const { error: uploadError } = await supabase.storage
.from(storageBucket)
.upload(storagePath, uploadedFile.buffer, {
contentType: uploadedFile.mimetype,
upsert: false
});

if (uploadError) {
console.log(uploadError);
return res.status(500).send('File upload failed');
}

await fileModel.create({
user: req.user.userId,
originalName: uploadedFile.originalname,
storedName: storagePath,
filePath: storagePath,
mimeType: uploadedFile.mimetype || 'application/octet-stream',
size: uploadedFile.size
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

const { data, error } = await supabase.storage
.from(storageBucket)
.download(file.filePath);

if (error || !data) {
console.log(error);
return res.status(500).send('Download failed');
}

const arrayBuffer = await data.arrayBuffer();
const fileBuffer = Buffer.from(arrayBuffer);

res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
res.send(fileBuffer);
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